import React, { useState, useEffect } from 'react';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import Card from '../components/common/Card';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({
    from_account_id: '',
    to_account_number: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsData, beneficiariesData] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getBeneficiaries(),
      ]);
      setAccounts(accountsData);
      setBeneficiaries(beneficiariesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const selectBeneficiary = (accountNumber) => {
    setFormData({ ...formData, to_account_number: accountNumber });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await transactionService.createTransfer({
        from_account_id: parseInt(formData.from_account_id),
        to_account_number: formData.to_account_number,
        amount: parseFloat(formData.amount),
        description: formData.description,
      });

      setSuccess(`Transfer successful! Reference: ${response.reference_number}`);
      setFormData({
        from_account_id: '',
        to_account_number: '',
        amount: '',
        description: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Transfer Money</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <Card>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Account
                  </label>
                  <select
                    name="from_account_id"
                    value={formData.from_account_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.account_type} - {account.account_number} (${account.balance})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Account Number
                  </label>
                  <input
                    type="text"
                    name="to_account_number"
                    value={formData.to_account_number}
                    onChange={handleChange}
                    required
                    placeholder="Enter 12-digit account number"
                    maxLength="12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="What's this transfer for?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 font-semibold"
                >
                  {loading ? 'Processing...' : 'Transfer Money'}
                </button>
              </form>
            </Card>
          </div>

          {/* Beneficiaries Sidebar */}
          <div>
            <Card title="Saved Beneficiaries">
              {beneficiaries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No saved beneficiaries</p>
              ) : (
                <div className="space-y-2">
                  {beneficiaries.map((beneficiary) => (
                    <button
                      key={beneficiary.id}
                      onClick={() => selectBeneficiary(beneficiary.account_number)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                    >
                      <p className="font-semibold text-gray-800">
                        {beneficiary.nickname || beneficiary.name}
                      </p>
                      <p className="text-sm text-gray-600">{beneficiary.account_number}</p>
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;