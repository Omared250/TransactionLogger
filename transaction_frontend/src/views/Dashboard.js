import React, { useState, useEffect, useCallback } from 'react';
import transactionsApi from '../api/transactions_api';
import '../App.css'; 

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  // Function to fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {      
      const response = await transactionsApi.get('/api/getTransactions'); 
      setTransactions(response.data);
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
      setError('Failed to load transactions. Is the backend running?');
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    try {
      await transactionsApi.post('/api/createTransactions', { // <-- Just the endpoint
        description,
        amount: parseFloat(amount),
      });

      setDescription('');
      setAmount('');
      fetchTransactions();
    } catch (e) {
      console.error("Failed to submit:", e);
      setError('Failed to submit transaction.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transaction Logger</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="transaction-form">
          <input
            type="text"
            placeholder="Description (e.g., Coffee)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Amount (e.g., -4.50)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
          />
          <button type="submit">Add Transaction</button>
        </form>

        <h2>History</h2>
        <ul className="transaction-list">
          {transactions.map((t) => (
            <li key={t.id}>
              <span>{t.description}</span>
              <span style={{ color: t.amount >= 0 ? 'green' : 'red' }}>
                ${t.amount}
              </span>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Dashboard;