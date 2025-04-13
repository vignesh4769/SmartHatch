import api from './config';

const employeeApi = {
  getEmployees: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/api/admin/employees', { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw { message: error.response?.data?.error || 'Failed to fetch employees', details: error.response?.data?.details };
    }
  },

  createEmployee: async (employeeData) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await api.post('/api/admin/employees/register', employeeData, config);
      return response.data;
    } catch (error) {
      throw { message: error.response?.data?.error || 'Failed to create employee', details: error.response?.data?.details };
    }
  },

  updateEmployee: async (id, employeeData) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await api.put(`/api/admin/employees/${id}`, employeeData, config);
      return response.data;
    } catch (error) {
      throw { message: error.response?.data?.error || 'Failed to update employee', details: error.response?.data?.details };
    }
  },

  deleteEmployee: async (id, reason) => {
    try {
      const response = await api.delete(`/api/admin/employees/${id}`, { data: { reason } });
      return response.data;
    } catch (error) {
      throw { message: error.response?.data?.error || 'Failed to delete employee', details: error.response?.data?.details };
    }
  },

  getEmployeeDetails: async (id) => {
    try {
      const response = await api.get(`/api/admin/employees/${id}`);
      return response.data;
    } catch (error) {
      throw { message: error.response?.data?.error || 'Failed to fetch employee details', details: error.response?.data?.details };
    }
  },

  searchEmployees: async (query) => {
    try {
      const response = await api.get('/api/admin/employees/search', { params: { query } });
      return response.data;
    } catch (error) {
      throw { message: error.response?.data?.error || 'Search failed', details: error.response?.data?.details };
    }
  }
};

export default employeeApi;