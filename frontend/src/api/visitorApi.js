import api from './config';

// Get all visitors
export const getVisitors = async () => {
  const response = await api.get('/api/visitors');
  return response.data;
};

// Add a new visitor
export const addVisitor = async (visitorData) => {
  const response = await api.post('/api/visitors', visitorData);
  return response.data;
};

// Check out a visitor
export const checkOutVisitor = async (visitorId) => {
  const response = await api.put(`/api/visitors/${visitorId}/checkout`);
  return response.data;
};

export default {
  getVisitors,
  addVisitor,
  checkOutVisitor
};