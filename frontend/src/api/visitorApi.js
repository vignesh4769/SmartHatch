import api from './config';

// Get all visitors
export const getVisitors = async () => {
  const response = await api.get('/api/admin/visitors');
  return response.data;
};

// Add a new visitor
export const addVisitor = async (visitorData) => {
  const response = await api.post('/api/admin/addvisitors', visitorData);
  return response.data;
};

// Check out a visitor
export const checkOutVisitor = async (visitorId) => {
  const response = await api.put(`/api/admin/visitors/${visitorId}/checkout`);
  return response.data;
};

export default {
  getVisitors,
  addVisitor,
  checkOutVisitor
};