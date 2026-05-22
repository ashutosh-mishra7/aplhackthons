import axiosClient, { notifyRequestListeners } from './axiosClient';

export const aiMonitoringService = {
  // Fetch real-time AI node statuses and routing graph topology
  getRoutingNetwork: async () => {
    const res = await axiosClient.get('/ai/network');
    notifyRequestListeners('GET', '/ai/network', null, { data: res.data });
    return res.data;
  },

  // Fetch AI processing logs
  getExecutionLogs: async () => {
    const res = await axiosClient.get('/ai/logs');
    notifyRequestListeners('GET', '/ai/logs', null, { data: res.data });
    return res.data;
  },

  // Fetch AI engine stats & metrics
  getEngineTelemetry: async () => {
    const res = await axiosClient.get('/ai/telemetry');
    notifyRequestListeners('GET', '/ai/telemetry', null, { data: res.data });
    return res.data;
  }
};
