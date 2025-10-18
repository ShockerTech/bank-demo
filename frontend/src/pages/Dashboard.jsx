// FILE: frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import accountService from '../services/accountService';
import transactionService from '../services/transactionService';
import Card from '../components/common/Card';
import ProfilePicture from '../components/ProfilePicture'; // ADD THIS IMPORT

const Dashboard = () => {
  const { user, logout } = useAuth(); // ADD logout here
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch accounts
      const accountsData = await accountService.getAccounts();
      console.log('Accounts Data:', accountsData); // DEBUG
      
      // Fetch transactions
      const transactionsData = await transactionService.getRecentTransactions();
      console.log('Transactions Data:', transactionsData); // DEBUG

      setAccounts(accountsData);
      setTransactions(transactionsData);

      // Calculate total balance
      const total = accountsData.reduce((sum, acc) => {
        const balance = parseFloat(acc.balance) || 0;
        return sum + balance;
      }, 0);
      
      console.log('Total Balance:', total); // DEBUG
      setTotalBalance(total);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      {/* ============================================= */}
      {/* ADDED: HEADER WITH PROFILE PICTURE */}
      {/* ============================================= */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <ProfilePicture user={user} size={40} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {user?.first_name || user?.username}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.first_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your financial overview</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Demo Warning */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
          <p className="font-bold">Demo Application</p>
        </div>

        {/* Total Balance */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <h2 className="text-lg opacity-90 mb-2">Total Balance</h2>
          <p className="text-4xl font-bold">
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-sm opacity-75 mt-2">
            Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </p>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> {/* CHANGED: 3 to 4 columns */}
          <Link
            to="/transfer"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-blue-600 text-4xl mb-2">💸</div>
            <h3 className="font-semibold">Transfer Money</h3>
          </Link>
          <Link
            to="/accounts"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-blue-600 text-4xl mb-2">💳</div>
            <h3 className="font-semibold">View Accounts</h3>
          </Link>
          <Link
            to="/transactions"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-blue-600 text-4xl mb-2">📊</div>
            <h3 className="font-semibold">Transaction History</h3>
          </Link>
          {/* ADDED: Profile Settings Quick Action */}
          <Link
            to="/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <div className="text-blue-600 text-4xl mb-2">👤</div>
            <h3 className="font-semibold">Profile Settings</h3>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounts */}
          <Card title="Your Accounts">
            {accounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No accounts yet</p>
                <Link to="/accounts" className="text-blue-600 hover:underline mt-2 inline-block">
                  Create an account
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold">{account.account_type}</p>
                      <p className="text-sm text-gray-600">{account.account_number}</p>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Transactions */}
          <Card title="Recent Transactions">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{txn.transaction_type}</p>
                      <p className="text-sm text-gray-600">{formatDate(txn.created_at)}</p>
                      {txn.description && (
                        <p className="text-xs text-gray-500">{txn.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        txn.to_account ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.to_account ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        txn.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        txn.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;