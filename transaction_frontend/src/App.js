import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  // Function to fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      // This request will be proxied by Nginx to our backend service
      const response = await fetch('/api/getTransactions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
      setError('Failed to load transactions. Is the backend running?');
    }
  }, []);

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    try {
      const response = await fetch('/api/createTransactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      // Clear form and reload transactions
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

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
