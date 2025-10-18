import api from './api';

const transactionService = {
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/banking/transactions/?${params}`);
    const data = response.data.results || response.data;
    return Array.isArray(data) ? data : [];
  },

  getRecentTransactions: async () => {
    const response = await api.get('/banking/transactions/recent/');
    const data = response.data.results || response.data;
    return Array.isArray(data) ? data : [];
  },

  createTransfer: async (transferData) => {
    const response = await api.post('/banking/transactions/transfer/', transferData);
    return response.data;
  },

  getBeneficiaries: async () => {
    const response = await api.get('/banking/beneficiaries/');
    const data = response.data.results || response.data;
    return Array.isArray(data) ? data : [];
  },

  addBeneficiary: async (beneficiaryData) => {
    const response = await api.post('/banking/beneficiaries/', beneficiaryData);
    return response.data;
  },

  deleteBeneficiary: async (beneficiaryId) => {
    await api.delete(`/banking/beneficiaries/${beneficiaryId}/`);
  },
};

export default transactionService;
