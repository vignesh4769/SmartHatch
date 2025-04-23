import api from './config';

const inventoryApi = {
  getInventoryItems: async (category, status) => {
    const params = {};
    if (category) params.category = category;
    if (status) params.status = status;
    
    const response = await api.get('/api/admin/inventory', { params });
    return response.data;
  },

  addInventoryItem: async (itemData) => {
    console.log('Sending inventory data:', itemData); 
    const response = await api.post('/api/admin/inventory', {
      itemName: itemData.name,
      category: itemData.category || 'other',
      quantity: itemData.quantity
    });
    console.log('Server response:', response.data); 
    return response.data;
  },
  updateInventoryItem: async (id, itemData) => {
    const response = await api.put(`/api/admin/inventory/${id}`, itemData);
    return response.data;
  },

  deleteInventoryItem: async (id) => {
    const response = await api.delete(`/api/admin/inventory/${id}`);
    return response.data;
  },

  createStockRequest: async (itemId, quantity, urgency, notes) => {
    const response = await api.post('/api/inventory/stock-requests', {
      itemId,
      quantity,
      urgency: urgency || 'normal',
      notes: notes || ''
    });
    return response.data;
  },

  getStockRequests: async (status) => {
    const params = {};
    if (status) params.status = status;
    
    const response = await api.get('/api/inventory/stock-requests', { params });
    return response.data;
  },

  updateStockRequest: async (id, status, notes) => {
    const response = await api.put(`/api/inventory/stock-requests/${id}`, {
      status,
      notes: notes || ''
    });
    return response.data;
  }
};

export default inventoryApi;