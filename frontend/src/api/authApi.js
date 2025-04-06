import axios from 'axios';

const API_URL = '/api/auth';

// Get auth header with token
export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (user && user.token) {
    return { 
      headers: { 
        Authorization: `Bearer ${user.token}` 
      } 
    };
  }
  return {};
};

// Login user
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('user');
};

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Verify email
export const verifyEmail = async (token) => {
  const response = await axios.post(`${API_URL}/verify-email`, { token });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password`, { 
    token, 
    password 
  });
  return response.data;
};

export default {
  getAuthHeader,
  login,
  logout,
  register,
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword
};