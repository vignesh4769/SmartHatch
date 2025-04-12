import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration and other auth errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear user data
      localStorage.removeItem('user');
      
      // Redirect to login page with a message
      const message = error.response?.data?.message || 'Your session has expired. Please login again.';
      window.location.href = `/login?message=${encodeURIComponent(message)}`;
      return Promise.reject(new Error(message));
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;