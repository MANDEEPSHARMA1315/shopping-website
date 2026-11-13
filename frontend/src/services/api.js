import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Request Interceptor: Attach JWT token if stored
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fashion_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth failures cleanly
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear invalid token on 401 token errors if desired
      // localStorage.removeItem('fashion_token');
    }
    return Promise.reject(error);
  }
);

export default API;
