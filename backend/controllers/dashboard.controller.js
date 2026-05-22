const Complaint = require('../models/Complaint');
const AILog = require('../models/AILog');

/**
 * Aggregates and returns system-wide metrics and analytics.
 * GET /api/dashboard/stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    console.log(`[Dashboard Controller] Computing executive analytics...`);

    // 1. Core KPIs
    const totalComplaints = await Complaint.countDocuments({});
    
    // Status metrics
    const statusCounts = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusBreakdown = {
      Pending: 0,
      'In Progress': 0,
      Resolved: 0,
      Escalated: 0
    };
    statusCounts.forEach(item => {
      if (item._id in statusBreakdown) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Escalations count
    const totalEscalated = await Complaint.countDocuments({ 
      $or: [{ requires_escalation: true }, { status: 'Escalated' }] 
    });

    // Average Priority Score
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$priority_score' } } }
    ]);
    const averagePriorityScore = priorityStats.length > 0 ? parseFloat(priorityStats[0].avgScore.toFixed(2)) : 0;

    // 2. Department Breakdown
    const departmentCounts = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const departmentBreakdown = departmentCounts.map(item => ({
      department: item._id,
      count: item.count
    }));

    // 3. Category Breakdown
    const categoryCounts = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const categoryBreakdown = categoryCounts.map(item => ({
      category: item._id,
      count: item.count
    }));

    // 4. Urgency Breakdown
    const urgencyCounts = await Complaint.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);
    const urgencyBreakdown = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };
    urgencyCounts.forEach(item => {
      if (item._id in urgencyBreakdown) {
        urgencyBreakdown[item._id] = item.count;
      }
    });

    // 5. Area / Geographical Heatmap
    const areaCounts = await Complaint.aggregate([
      { $group: { _id: '$area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 } // Top 10 hotspots
    ]);
    const areaBreakdown = areaCounts.map(item => ({
      area: item._id,
      count: item.count
    }));

    // 6. AI Engine Telemetry (Performance & Quality assurance)
    const totalLogs = await AILog.countDocuments({});
    
    const fallbackCount = await AILog.countDocuments({ usedFallback: true });
    const successCount = await AILog.countDocuments({ success: true, usedFallback: false });
    
    const latencyStats = await AILog.aggregate([
      { $group: { _id: null, avgLatency: { $avg: '$latency_ms' } } }
    ]);
    const averageLatencyMs = latencyStats.length > 0 ? Math.round(latencyStats[0].avgLatency) : 0;

    // AI Success rate (runs without falling back to keywords)
    const aiSuccessRate = totalLogs > 0 ? parseFloat((((totalLogs - fallbackCount) / totalLogs) * 100).toFixed(2)) : 100;

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      kpis: {
        totalComplaints,
        activeEscalations: totalEscalated,
        averagePriorityScore,
        aiSuccessRatePercent: aiSuccessRate
      },
      breakdowns: {
        status: statusBreakdown,
        urgency: urgencyBreakdown,
        departments: departmentBreakdown,
        categories: categoryBreakdown,
        hotspots: areaBreakdown
      },
      telemetry: {
        totalAIRequests: totalLogs,
        geminiSuccesses: successCount,
        fallbackBypasses: fallbackCount,
        averageLatencyMs
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
