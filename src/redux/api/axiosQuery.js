// utils/axiosConfig.js or config/axios.js
import axios from 'axios';

// Create different axios instances for different timeout needs
export const defaultAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.yogawithjen.life/api/v1',
  timeout: 30000, // 30 seconds for regular requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Special axios instance for video uploads with longer timeout
export const videoUploadAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.yogawithjen.life/api/v1',
  timeout: 600000, // 10 minutes timeout for video uploads
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// For very large files, you might want even longer timeout
export const largeFileUploadAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.yogawithjen.life/api/v1',
  timeout: 1800000, // 30 minutes timeout for very large files
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Common request interceptor for all instances
const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      // Add auth token from localStorage or Redux store
      const token = localStorage.getItem('authToken') || 
                   sessionStorage.getItem('authToken') ||
                   localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('token');
        // Redirect to login or dispatch logout action
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for all instances
setupInterceptors(defaultAxios);
setupInterceptors(videoUploadAxios);
setupInterceptors(largeFileUploadAxios);

export default defaultAxios;