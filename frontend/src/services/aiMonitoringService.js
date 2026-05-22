import axiosClient, { notifyRequestListeners } from './axiosClient';
import { mockAiLogs, mockRoutingNetwork } from './mockData';

export const aiMonitoringService = {
  // Fetch real-time AI node statuses and routing graph topology
  getRoutingNetwork: async () => {
    await axiosClient.get('/ai/network');
    notifyRequestListeners('GET', '/ai/network', null, { data: mockRoutingNetwork });
    return mockRoutingNetwork;
  },

  // Fetch AI processing logs
  getExecutionLogs: async () => {
    await axiosClient.get('/ai/logs');
    notifyRequestListeners('GET', '/ai/logs', null, { data: mockAiLogs });
    return mockAiLogs;
  },

  // Fetch AI engine stats & metrics
  getEngineTelemetry: async () => {
    await axiosClient.get('/ai/telemetry');
    
    // Simulate real-time fluctuating telemetry
    const telemetry = {
      cpuUsage: Math.round(35 + Math.random() * 15),
      memoryUsage: Math.round(62 + Math.random() * 5),
      averageLatencyMs: Math.round(280 + Math.random() * 40),
      requestsPerMinute: Math.round(120 + Math.random() * 15),
      uptimeDays: 142,
      modelName: 'JanMitra-Cognitive-v2.5',
      embeddingDimension: 1536,
      tokensProcessed: 1429810,
      activeTriggersCount: 8,
      queueSize: Math.floor(Math.random() * 4) + 1
    };

    notifyRequestListeners('GET', '/ai/telemetry', null, { data: telemetry });
    return telemetry;
  }
};
