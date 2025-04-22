import api from './config';

const messApi = {
  getSchedules: (params) => api.get('/api/admin/mess', { params }),
  createSchedule: (data) => api.post('/api/admin/mess', data),
  updateSchedule: (id, data) => api.put(`/api/admin/mess/${id}`, data),
  deleteSchedule: (id) => api.delete(`/api/admin/mess/${id}`)
};

export default messApi;
