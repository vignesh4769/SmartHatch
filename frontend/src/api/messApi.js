import api from './config';

const messApi = {
  // Admin routes
  getSchedules: (params) => api.get('/api/admin/mess', { params }),
  createSchedule: (data) => api.post('/api/admin/mess', data),
  updateSchedule: (id, data) => api.put(`/api/admin/mess/${id}`, data),
  deleteSchedule: (id) => api.delete(`/api/admin/mess/${id}`),
  
  // Employee routes
  getEmployeeMess: async () => {
    try {
      const response = await api.get('/api/employee/mess');
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error.response?.data || error;
    }
  },
};

export default messApi;
