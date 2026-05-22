const mongoose = require('mongoose');
const seedDefaultComplaints = require('../utils/seeder');

// Disable Mongoose command buffering globally right away!
mongoose.set('bufferCommands', false);

// Global arrays to act as our local in-memory database fallback
global.inMemoryComplaints = [];
global.inMemoryAILogs = [];
global.dbFallbackMode = false;

/**
 * Monkey-patches Mongoose methods to work in-memory if MongoDB connection fails or is connecting.
 */
const setupDatabaseFallback = () => {
  // 1. Monkey-patch Model.prototype.save
  const originalSave = mongoose.Model.prototype.save;
  mongoose.Model.prototype.save = async function (options) {
    if (global.dbFallbackMode || mongoose.connection.readyState !== 1) {
      const modelName = this.constructor.modelName;
      
      if (!this._id) {
        this._id = new mongoose.Types.ObjectId();
      }
      if (!this.createdAt) {
        this.createdAt = new Date();
      }
      
      const docObj = this.toObject();
      
      if (modelName === 'Complaint') {
        const existingIdx = global.inMemoryComplaints.findIndex(c => c._id.toString() === this._id.toString());
        if (existingIdx > -1) {
          global.inMemoryComplaints[existingIdx] = docObj;
        } else {
          global.inMemoryComplaints.push(docObj);
        }
      } else if (modelName === 'AILog') {
        const existingIdx = global.inMemoryAILogs.findIndex(l => l._id.toString() === this._id.toString());
        if (existingIdx > -1) {
          global.inMemoryAILogs[existingIdx] = docObj;
        } else {
          global.inMemoryAILogs.push(docObj);
        }
      }
      
      return this;
    }
    return originalSave.apply(this, arguments);
  };

  // 2. Monkey-patch Model.create (seeder and controllers call this)
  const originalCreate = mongoose.Model.create;
  mongoose.Model.create = async function (docs, options) {
    if (global.dbFallbackMode || mongoose.connection.readyState !== 1) {
      const isArray = Array.isArray(docs);
      const docsArr = isArray ? docs : [docs];
      const createdDocs = [];
      
      for (const doc of docsArr) {
        let instance;
        if (doc instanceof mongoose.Model) {
          instance = doc;
        } else {
          instance = new this(doc);
        }
        await instance.save();
        createdDocs.push(instance);
      }
      
      return isArray ? createdDocs : createdDocs[0];
    }
    return originalCreate.apply(this, arguments);
  };

  // 3. Monkey-patch Model.insertMany
  const originalInsertMany = mongoose.Model.insertMany;
  mongoose.Model.insertMany = async function (docs, options) {
    if (global.dbFallbackMode || mongoose.connection.readyState !== 1) {
      return this.create(docs, options);
    }
    return originalInsertMany.apply(this, arguments);
  };

  // 4. Monkey-patch Query.prototype.exec
  const originalQueryExec = mongoose.Query.prototype.exec;
  mongoose.Query.prototype.exec = async function () {
    if (global.dbFallbackMode || mongoose.connection.readyState !== 1) {
      const modelName = this.model.modelName;
      const op = this.op;
      const queryObj = this._conditions || {};
      const options = this.options || {};
      
      const source = modelName === 'Complaint' ? global.inMemoryComplaints : global.inMemoryAILogs;
      
      // Filter list
      let filtered = source.filter(item => {
        for (const key in queryObj) {
          const val = queryObj[key];
          
          // Support text search $text
          if (key === '$text' && val && val.$search) {
            const term = val.$search.toLowerCase();
            const titleMatch = (item.title || '').toLowerCase().includes(term);
            const descMatch = (item.description || '').toLowerCase().includes(term);
            const areaMatch = (item.area || '').toLowerCase().includes(term);
            if (!titleMatch && !descMatch && !areaMatch) return false;
            continue;
          }
          
          // Support OR operator $or
          if (key === '$or' && Array.isArray(val)) {
            const matchesOr = val.some(orQuery => {
              for (const orKey in orQuery) {
                const orVal = orQuery[orKey];
                if (item[orKey] === orVal) return true;
              }
              return false;
            });
            if (!matchesOr) return false;
            continue;
          }
          
          // Support IN operator $in
          if (val && typeof val === 'object' && val.$in && Array.isArray(val.$in)) {
            if (!val.$in.includes(item[key])) return false;
            continue;
          }

          // Support range operators ($gte, $gt, $lte, $lt)
          if (val && typeof val === 'object') {
            let matchesRange = true;
            if ('$gte' in val && item[key] < val.$gte) matchesRange = false;
            if ('$gt' in val && item[key] <= val.$gt) matchesRange = false;
            if ('$lte' in val && item[key] > val.$lte) matchesRange = false;
            if ('$lt' in val && item[key] >= val.$lt) matchesRange = false;
            if (!matchesRange) return false;
            continue;
          }
          
          // Direct property check
          if (item[key] !== val) return false;
        }
        return true;
      });
      
      if (op === 'countDocuments') {
        return filtered.length;
      }
      
      if (op === 'findOne') {
        const searchId = queryObj._id;
        if (searchId) {
          const found = filtered.find(item => item._id.toString() === searchId.toString());
          return found ? this.model.hydrate(found) : null;
        }
        return filtered[0] ? this.model.hydrate(filtered[0]) : null;
      }
      
      // Default Sort: createdAt descending
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Skip & Limit pagination
      if (options.skip) {
        filtered = filtered.slice(options.skip);
      }
      if (options.limit) {
        filtered = filtered.slice(0, options.limit);
      }
      
      // Hydrate all items back to Mongoose documents so they have Mongoose model methods (e.g. .save())
      return filtered.map(item => this.model.hydrate(item));
    }
    return originalQueryExec.apply(this, arguments);
  };

  // 5. Monkey-patch Aggregate.prototype.exec
  const originalAggregateExec = mongoose.Aggregate.prototype.exec;
  mongoose.Aggregate.prototype.exec = async function () {
    if (global.dbFallbackMode || mongoose.connection.readyState !== 1) {
      const modelName = this.model.modelName;
      const pipeline = this._pipeline || [];
      
      const complaints = global.inMemoryComplaints || [];
      const ailogs = global.inMemoryAILogs || [];
      
      // Find the group stage
      const groupStage = pipeline.find(stage => stage.$group);
      if (!groupStage) return [];
      
      const groupConfig = groupStage.$group;
      const idField = groupConfig._id; // e.g., '$status', '$department', etc.
      
      if (modelName === 'Complaint') {
        if (idField === '$status') {
          const counts = {};
          complaints.forEach(c => {
            counts[c.status] = (counts[c.status] || 0) + 1;
          });
          return Object.keys(counts).map(key => ({ _id: key, count: counts[key] }));
        }
        
        if (idField === null && groupConfig.avgScore) {
          const totalScore = complaints.reduce((sum, c) => sum + (c.priority_score || 0), 0);
          const avg = complaints.length > 0 ? totalScore / complaints.length : 0;
          return [{ _id: null, avgScore: avg }];
        }
        
        if (idField === '$department') {
          const counts = {};
          complaints.forEach(c => {
            counts[c.department] = (counts[c.department] || 0) + 1;
          });
          const res = Object.keys(counts).map(key => ({ _id: key, count: counts[key] }));
          res.sort((a, b) => b.count - a.count);
          return res;
        }
        
        if (idField === '$category') {
          const counts = {};
          complaints.forEach(c => {
            counts[c.category] = (counts[c.category] || 0) + 1;
          });
          const res = Object.keys(counts).map(key => ({ 
            _id: key, 
            count: counts[key],
            value: counts[key]
          }));
          res.sort((a, b) => b.count - a.count);
          return res;
        }
        
        if (idField === '$urgency') {
          const counts = {};
          complaints.forEach(c => {
            counts[c.urgency] = (counts[c.urgency] || 0) + 1;
          });
          return Object.keys(counts).map(key => ({ _id: key, count: counts[key] }));
        }
        
        if (idField === '$area') {
          const counts = {};
          complaints.forEach(c => {
            counts[c.area] = (counts[c.area] || 0) + 1;
          });
          const res = Object.keys(counts).map(key => ({ _id: key, count: counts[key] }));
          res.sort((a, b) => b.count - a.count);
          return res.slice(0, 10);
        }
      }
      
      if (modelName === 'AILog') {
        if (idField === null && groupConfig.avgLatency) {
          const totalLatency = ailogs.reduce((sum, l) => sum + (l.latency_ms || 0), 0);
          const avg = ailogs.length > 0 ? totalLatency / ailogs.length : 0;
          return [{ _id: null, avgLatency: avg }];
        }
      }
      
      return [];
    }
    return originalAggregateExec.apply(this, arguments);
  };
};

// Setup patches synchronously at microsecond 0 so that no API calls buffer during Mongoose startup!
setupDatabaseFallback();

// Seed initial in-memory dataset synchronously/instantly
(async () => {
  try {
    await seedDefaultComplaints();
    console.log('[Database] Pre-seeded in-memory database successfully at startup.');
  } catch (err) {
    console.error('[Database Error] Failed to pre-seed in-memory database:', err.message);
  }
})();

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janmitra_ai';
    console.log(`[Database] Connecting to MongoDB...`);
    
    // Set a connection timeout option so it fails fast rather than buffering endlessly
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds
    });
    
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.log(`[Database] Activating local in-memory database fallback...`);
    
    global.dbFallbackMode = true;
    
    console.log('\n=============================================================');
    console.log('[Database Warning] JANMITRA AI IS OPERATING IN LOCAL IN-MEMORY DB FALLBACK MODE!');
    console.log('[Database Warning] All grievance actions, status changes, timeline events,');
    console.log('[Database Warning] and AI metrics dashboards will function 100% locally in-memory.');
    console.log('=============================================================\n');
  }
};

module.exports = connectDB;
