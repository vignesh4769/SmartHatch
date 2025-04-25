import api from './config';

export const LeaveApi = {
  // Employee endpoints
  applyLeave: (data) => api.post('/api/employee/leaves', { type: data.type, startDate: data.startDate, endDate: data.endDate, reason: data.reason }),
  getMyLeaves: () => api.get('/api/employee/leaves'),
  
  // Admin endpoints
  getPendingLeaves: () => api.get('/api/admin/leaves/pending'),
  getAllLeaves: () => api.get('/api/admin/leaves'),
  updateLeaveStatus: (id, data) => api.put(`/api/admin/leaves/${id}`, { status: data.status, adminNotes: data.adminNotes })
};

export default LeaveApi;
