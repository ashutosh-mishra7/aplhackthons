const mongoose = require('mongoose');
const seedDefaultComplaints = require('../utils/seeder');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/janmitra_ai';
    console.log(`[Database] Connecting to MongoDB...`);
    
    const conn = await mongoose.connect(connUri);
    
    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Automatically seed default complaints if they don't exist
    await seedDefaultComplaints();
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
