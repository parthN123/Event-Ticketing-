              import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'https://event-ticketing-c8e8.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON
    if (response.data && typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('Received HTML instead of JSON from API. Backend may not be running properly.');
      console.error('Response:', response.data.substring(0, 200) + '...');
      throw new Error('Backend returned HTML instead of JSON. Please check if backend is running.');
    }
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS Error: Backend may not be configured for this domain');
      console.error('Current origin:', window.location.origin);
      console.error('Backend URL:', api.defaults.baseURL);
    }
    
    // Handle HTML responses
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!doctype html>')) {
      console.error('Backend returned HTML instead of JSON. This usually means:');
      console.error('1. Backend is not running');
      console.error('2. Wrong API endpoint');
      console.error('3. Backend routing issue');
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 