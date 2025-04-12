import api from './config';

const dashboardService = {
  // Regular user dashboard
  getUserDashboard: async () => {
    const response = await api.get('/api/employee/dashboard');
    return response.data;
  },

  // Admin dashboard
  getAdminDashboard: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  // Mess management
  getMessSchedule: async () => {
    const response = await api.get('/api/employee/mess-schedule');
    return response.data;
  },

  getMessStats: async () => {
    const response = await api.get('/api/mess/stats');
    return response.data;
  },

  // Visitor management
  getVisitors: async () => {
    const response = await api.get('/api/visitor');
    return response.data;
  },

  getVisitorStats: async () => {
    const response = await api.get('/api/visitor/stats');
    return response.data;
  },

  registerVisitor: async (visitorData) => {
    const response = await api.post('/api/visitor', visitorData);
    return response.data;
  },

  checkoutVisitor: async (visitorId) => {
    const response = await api.put(`/api/visitor/${visitorId}/checkout`);
    return response.data;
  },

  // Inventory management
  getInventory: async () => {
    const response = await api.get('/api/inventory');
    return response.data;
  },

  createStockRequest: async (stockData) => {
    const response = await api.post('/api/employee/stock-requests', stockData);
    return response.data;
  },

  updateStockRequest: async (requestId, updateData) => {
    const response = await api.put(`/api/inventory/stock-requests/${requestId}`, updateData);
    return response.data;
  },
};

export default dashboardService;