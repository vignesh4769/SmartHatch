import api from './config';

const financialApi = {
  // Get financial statistics
  getFinancialStats: async () => {
    const response = await api.get('/api/financials');
    return response.data;
  },

  // Get all transactions
  getTransactions: async () => {
    const response = await api.get('/api/financials/transactions');
    return response.data;
  },

  // Create or update financial record for fiscal year
  createFinancialRecord: async (financialData) => {
    const response = await api.post('/api/financials', financialData);
    return response.data;
  },

  // Record a financial transaction
  recordTransaction: async (transactionData) => {
    const response = await api.post('/api/financials/transactions', transactionData);
    return response.data;
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/api/financials/transactions/${id}`, transactionData);
    return response.data;
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    const response = await api.delete(`/api/financials/transactions/${id}`);
    return response.data;
  },

  // Get financial summary
  getFinancialSummary: async (fiscalYear) => {
    const params = {};
    if (fiscalYear) params.fiscalYear = fiscalYear;
    
    const response = await api.get('/api/financials/summary', { params });
    return response.data;
  },

  // Generate monthly financial report
  generateMonthlyReport: async (month, year) => {
    const params = { month, year };
    const response = await api.get('/api/financials/monthly-report', { params });
    return response.data;
  }
};

export default financialApi;