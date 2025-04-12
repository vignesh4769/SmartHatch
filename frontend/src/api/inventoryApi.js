import api from './config';

const inventoryApi = {
  // Get all inventory items
  getInventoryItems: async (category, status) => {
    const params = {};
    if (category) params.category = category;
    if (status) params.status = status;
    
    const response = await api.get('/api/inventory', { params });
    return response.data;
  },

  // Add new inventory item
  addInventoryItem: async (itemData) => {
    const response = await api.post('/api/inventory', itemData);
    return response.data;
  },

  // Update inventory item
  updateInventoryItem: async (id, itemData) => {
    const response = await api.put(`/api/inventory/${id}`, itemData);
    return response.data;
  },

  // Delete inventory item
  deleteInventoryItem: async (id) => {
    const response = await api.delete(`/api/inventory/${id}`);
    return response.data;
  },

  // Create stock request
  createStockRequest: async (requestData) => {
    const response = await api.post('/api/inventory/stock-requests', requestData);
    return response.data;
  },

  // Get all stock requests
  getStockRequests: async (status) => {
    const params = {};
    if (status) params.status = status;
    
    const response = await api.get('/api/inventory/stock-requests', { params });
    return response.data;
  },

  // Update stock request status
  updateStockRequest: async (id, updateData) => {
    const response = await api.put(`/api/inventory/stock-requests/${id}`, updateData);
    return response.data;
  }
};

export default inventoryApi;