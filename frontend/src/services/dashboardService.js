import axiosClient, { notifyRequestListeners } from './axiosClient';
import { initialDepartments } from './mockData';

// Fetch current local storage complaints list
const getStoredComplaints = () => {
  const data = localStorage.getItem('janmitra_complaints');
  return data ? JSON.parse(data) : [];
};

export const dashboardService = {
  getStats: async () => {
    await axiosClient.get('/dashboard/stats');
    const complaints = getStoredComplaints();
    
    const total = complaints.length;
    const pending = complaints.filter(c => c.status !== 'Resolved').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const escalated = complaints.filter(c => c.aiAnalysis?.requires_escalation || c.status === 'Escalated').length;
    
    // SLA compliance rate: percentage of resolved complaints that didn't exceed SLA, or estimated compliance
    const slaCompliantCount = complaints.filter(c => {
      if (c.status === 'Resolved') {
        const submitted = new Date(c.submittedAt);
        const resolvedAt = new Date(c.timeline[c.timeline.length - 1].timestamp);
        const diffDays = (resolvedAt - submitted) / (1000 * 60 * 60 * 24);
        return diffDays <= c.aiAnalysis.ticket_sla_days;
      }
      return !c.aiAnalysis.requires_escalation;
    }).length;
    
    const slaCompliance = total > 0 ? Math.round((slaCompliantCount / total) * 100) : 100;
    
    // Health score: SLA Compliance * 0.7 + Citizen satisfaction * 6 (normalized to 100)
    const satisfactionAvg = 4.3; // Seed average
    const governanceHealth = Math.round((slaCompliance * 0.7) + (satisfactionAvg * 6));

    const stats = {
      total,
      pending,
      resolved,
      escalated,
      slaCompliance,
      governanceHealth,
      satisfactionAverage: satisfactionAvg
    };

    notifyRequestListeners('GET', '/dashboard/stats', null, { data: stats });
    return stats;
  },

  getDepartmentStats: async () => {
    await axiosClient.get('/dashboard/departments');
    const complaints = getStoredComplaints();
    
    // Map initial departments and update totals with local storage changes
    const deptStats = initialDepartments.map(dept => {
      const deptComplaints = complaints.filter(c => c.aiAnalysis.department.toLowerCase().includes(dept.id) || c.aiAnalysis.department === dept.name);
      const totalCount = deptComplaints.length;
      const resolvedCount = deptComplaints.filter(c => c.status === 'Resolved').length;
      const escalatedCount = deptComplaints.filter(c => c.aiAnalysis.requires_escalation).length;
      
      const rate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : dept.throughput;
      
      return {
        ...dept,
        complaintsCount: totalCount > 0 ? totalCount : dept.complaintsCount,
        throughput: rate,
        slaBreaches: escalatedCount > 0 ? escalatedCount : dept.slaBreaches
      };
    });

    notifyRequestListeners('GET', '/dashboard/departments', null, { data: deptStats });
    return deptStats;
  },

  getHeatmapData: async () => {
    await axiosClient.get('/dashboard/heatmap');
    
    // Coordinates representing Lucknow municipal hot spots
    const heatmap = [
      { name: 'Gomti Nagar', latitude: 26.8478, longitude: 80.9984, weight: 85, complaints: 42, color: '#f43f5e' },
      { name: 'Hazratganj', latitude: 26.8504, longitude: 80.9497, weight: 95, complaints: 56, color: '#ef4444' },
      { name: 'Aliganj', latitude: 26.8906, longitude: 80.9416, weight: 65, complaints: 28, color: '#f59e0b' },
      { name: 'Indira Nagar', latitude: 26.8837, longitude: 81.0004, weight: 70, complaints: 32, color: '#f59e0b' },
      { name: 'Charbagh', latitude: 26.8322, longitude: 80.9221, weight: 90, complaints: 49, color: '#ef4444' },
      { name: 'Chowk', latitude: 26.8662, longitude: 80.8924, weight: 50, complaints: 18, color: '#10b981' },
      { name: 'Aminabad', latitude: 26.8465, longitude: 80.9298, weight: 80, complaints: 39, color: '#f43f5e' }
    ];

    notifyRequestListeners('GET', '/dashboard/heatmap', null, { data: heatmap });
    return heatmap;
  },

  getAnalyticsCharts: async () => {
    await axiosClient.get('/dashboard/analytics');
    const complaints = getStoredComplaints();
    
    // 1. Complaint Volume Trend (past 7 days)
    const trends = [
      { date: '16 May', total: 24, resolved: 18, escalated: 2 },
      { date: '17 May', total: 32, resolved: 22, escalated: 4 },
      { date: '18 May', total: 40, resolved: 30, escalated: 3 },
      { date: '19 May', total: 38, resolved: 28, escalated: 5 },
      { date: '20 May', total: 45, resolved: 35, escalated: 2 },
      { date: '21 May', total: 55, resolved: 41, escalated: 6 },
      { date: '22 May', total: complaints.length + 30, resolved: complaints.filter(c => c.status === 'Resolved').length + 25, escalated: complaints.filter(c => c.aiAnalysis.requires_escalation).length + 3 }
    ];

    // 2. AI Confidence Score distribution
    const confidenceDist = [
      { range: '60-70%', count: 8 },
      { range: '70-80%', count: 18 },
      { range: '80-90%', count: 42 },
      { range: '90-100%', count: 96 }
    ];

    // 3. Category distribution (Pie Chart)
    const categoryCounts = {};
    complaints.forEach(c => {
      const cat = c.aiAnalysis.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryData = Object.keys(categoryCounts).map(name => ({
      name,
      value: categoryCounts[name]
    }));

    if (categoryData.length === 0) {
      categoryData.push({ name: 'General', value: 1 });
    }

    const response = {
      trends,
      confidenceDist,
      categoryData
    };

    notifyRequestListeners('GET', '/dashboard/analytics', null, { data: response });
    return response;
  }
};
