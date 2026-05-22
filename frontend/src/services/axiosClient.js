import axios from 'axios';

// Creating an Axios client that intercepts calls to simulate actual API logic.
const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// A local listener array so our AI Monitoring screen can subscribe to live network operations in real time!
const requestListeners = [];

export const subscribeToRequests = (callback) => {
  requestListeners.push(callback);
  return () => {
    const idx = requestListeners.indexOf(callback);
    if (idx !== -1) requestListeners.splice(idx, 1);
  };
};

const notifyRequestListeners = (type, url, payload, response) => {
  requestListeners.forEach(cb => cb({
    timestamp: new Date().toISOString(),
    type,
    url,
    payload,
    response
  }));
};

// Request Interceptor: Emulates latency and resolves mock data
axiosClient.interceptors.request.use(async (config) => {
  // Simulate network latency (400ms - 900ms)
  const delay = Math.floor(Math.random() * 500) + 400;
  await new Promise(resolve => setTimeout(resolve, delay));
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
export { notifyRequestListeners };
