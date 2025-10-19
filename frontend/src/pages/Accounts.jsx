import React, { useState, useEffect } from 'react';
import accountService from '../services/accountService';
import Card from '../components/common/Card';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ account_type: 'CHECKING' });
  // ADDED: State for download loading per account
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await accountService.createAccount(newAccount);
      setShowModal(false);
      setNewAccount({ account_type: 'CHECKING' });
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  // ADDED: Download statement function
  const downloadStatement = async (accountId) => {
    try {
      setDownloadingId(accountId); // Show loading state
      
      // Get token from localStorage (adjust if you store it differently)
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        alert('Please login again');
        return;
      }
      
      const response = await fetch(
        `https://bank-demo-production.up.railway.app/api/banking/accounts/${accountId}/statement/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to download statement');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(url, '_blank');
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error downloading statement:', error);
      alert('Failed to download statement. Please try again.');
    } finally {
      setDownloadingId(null); // Remove loading state
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Accounts</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {account.account_type.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600">{account.account_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  account.status === 'FROZEN' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {account.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(account.balance)}
                </p>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>Currency: {account.currency}</p>
                <p>Created: {new Date(account.created_at).toLocaleDateString()}</p>
              </div>

              {/* ADDED: Download Statement Button */}
              <button
                onClick={() => downloadStatement(account.id)}
                disabled={downloadingId === account.id}
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center ${
                  downloadingId === account.id
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {downloadingId === account.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Download Statement
                  </>
                )}
              </button>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500 mb-4">You don't have any accounts yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Account
            </button>
          </Card>
        )}

        {/* Create Account Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Account</h2>
              <form onSubmit={handleCreateAccount}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    value={newAccount.account_type}
                    onChange={(e) => setNewAccount({ ...newAccount, account_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CHECKING">Checking Account</option>
                    <option value="SAVINGS">Savings Account</option>
                    <option value="BUSINESS">Business Account</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;