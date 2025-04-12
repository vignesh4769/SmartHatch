import api from './config';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : '/api/auth';

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post(`${API_URL}/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Authentication failed');
    }
    throw new Error('Network error - please try again');
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post(`${API_URL}/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  }
  localStorage.removeItem('user');
};

// Register user
export const register = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

// Get current user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Verify email
export const verifyEmail = async (token) => {
  const response = await api.post(`${API_URL}/verify-email`, { token });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.post(`${API_URL}/reset-password`, { 
    token, 
    password 
  });
  return response.data;
};

export default {
  login,
  logout,
  register,
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword
};