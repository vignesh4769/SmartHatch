import api from './config';

const financialApi = {
  getTransactions: async () => {
    try {
      const response = await api.get('/api/financials/transactions');
      return response.data.data || response.data; // Handle both response structures
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  recordTransaction: async (transactionData) => {
    try {
      const response = await api.post('/api/financials/transactions', transactionData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/api/financials/transactions/${id}`, transactionData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/api/financials/transactions/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },
};

export default financialApi;