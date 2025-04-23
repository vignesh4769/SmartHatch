import api from './config';

const API_URL = '/api';

export const getDashboardData = async () => {
  try {
    const response = await api.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch dashboard data' };
  }
};

export const getEmployeeDashboardStats = async () => {
  try {
    const response = await api.get(`${API_URL}/employee/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch employee dashboard stats' };
  }
};

export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get(`${API_URL}/admin/dashboard/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch admin dashboard stats' };
  }
};