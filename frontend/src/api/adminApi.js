import api from './config';

const API_URL = '/api/admin';


export const getEmployeeDashboardStats = async () => {
  try {
    const response = await api.get(`${API_URL}/employees/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch dashboard stats' };
  }
};

