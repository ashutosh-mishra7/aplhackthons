import axios from 'axios';

// Creating an Axios client that points to our live backend API.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://apl-hackathon-backend.onrender.com/api',
  timeout: 10000,
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

export default axiosClient;
export { notifyRequestListeners };

