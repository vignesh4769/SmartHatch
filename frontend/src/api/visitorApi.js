import api from './config';

const visitorApi = {
  // Register a new visitor
  registerVisitor: async (visitorData) => {
    const response = await api.post('/api/visitors', visitorData);
    return response.data;
  },

  // Check out visitor
  checkoutVisitor: async (visitorId) => {
    const response = await api.put(`/api/visitors/${visitorId}/checkout`);
    return response.data;
  },

  // Get all visitors for a date range
  getVisitors: async (startDate, endDate, status) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (status) params.status = status;
    
    const response = await api.get('/api/visitors', { params });
    return response.data;
  },

  // Get visitor statistics
  getVisitorStats: async (startDate, endDate) => {
    const params = { startDate, endDate };
    const response = await api.get('/api/visitors/stats', { params });
    return response.data;
  }
};

export default visitorApi;