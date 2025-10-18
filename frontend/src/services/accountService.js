import api from './api';

const accountService = {
  getAccounts: async () => {
    const response = await api.get('/banking/accounts/');
    // Handle paginated and non-paginated responses safely
    const data = response.data.results || response.data;
    return Array.isArray(data) ? data : [];
  },

  getAccountDetail: async (accountId) => {
    const response = await api.get(`/banking/accounts/${accountId}/`);
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await api.post('/banking/accounts/', accountData);
    return response.data;
  },

  getBalance: async (accountId) => {
    const response = await api.get(`/banking/accounts/${accountId}/balance/`);
    return response.data;
  },
};

export default accountService;
