import api from './config';

const inventoryApi = {
  // Get all inventory items with optional filtering
  getInventoryItems: async (category, status) => {
    const params = {};
    if (category) params.category = category;
    if (status) params.status = status;
    
    const response = await api.get('/api/inventory', { params });
    return response.data;
  },

  // Add new inventory item
  addInventoryItem: async (itemData) => {
    const response = await api.post('/api/inventory', {
      itemName: itemData.name,
      category: itemData.category || 'other',
      quantity: itemData.quantity,
      unit: itemData.unit || 'units',
      unitPrice: itemData.unitPrice || 0,
      reorderPoint: itemData.reorderPoint || 5,
      supplier: itemData.supplier || {},
      location: itemData.location || 'Main Storage',
      description: itemData.description || ''
    });
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
  createStockRequest: async (itemId, quantity, urgency, notes) => {
    const response = await api.post('/api/inventory/stock-requests', {
      itemId,
      quantity,
      urgency: urgency || 'normal',
      notes: notes || ''
    });
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
  updateStockRequest: async (id, status, notes) => {
    const response = await api.put(`/api/inventory/stock-requests/${id}`, {
      status,
      notes: notes || ''
    });
    return response.data;
  }
};

export default inventoryApi;