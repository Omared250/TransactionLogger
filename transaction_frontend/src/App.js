// import React, { useState, useEffect, useCallback } from 'react';
// import './App.css';
// import transactionsApi from './api/transactions_api';


// function App() {
//   const [transactions, setTransactions] = useState([]);
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [error, setError] = useState(null);

//   // Function to fetch transactions
//   const fetchTransactions = useCallback(async () => {
//     try {
//       // 2. Use axios.get and access response.data
//       const response = await transactionsApi.get('/getTransactions');
//       setTransactions(response.data);
//     } catch (e) {
//       console.error("Failed to fetch transactions:", e);
//       setError('Failed to load transactions. Is the backend running?');
//     }
//   }, []);

//   // Fetch transactions on component mount
//   useEffect(() => {
//     fetchTransactions();
//   }, [fetchTransactions]);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!description || !amount) return;

//     try {
//       // 3. Use axios.post, just pass the data object
//       await transactionsApi.post('/createTransactions', {
//         description,
//         amount: parseFloat(amount),
//       });

//       // Clear form and reload transactions
//       setDescription('');
//       setAmount('');
//       fetchTransactions();
//     } catch (e) {
//       console.error("Failed to submit:", e);
//       setError('Failed to submit transaction.');
//     }
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Transaction Logger</h1>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
        
//         <form onSubmit={handleSubmit} className="transaction-form">
//           <input
//             type="text"
//             placeholder="Description (e.g., Coffee)"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Amount (e.g., -4.50)"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             step="0.01"
//             required
//           />
//           <button type="submit">Add Transaction</button>
//         </form>

//         <h2>History</h2>
//         <ul className="transaction-list">
//           {transactions.map((t) => (
//             <li key={t.id}>
//               <span>{t.description}</span>
//               <span style={{ color: t.amount >= 0 ? 'green' : 'red' }}>
//                 ${t.amount}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import DailyReport from './views/DailyReport';
import MonthlyReport from './views/MonthlyReport';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="App-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/daily">Daily Report</Link>
          <Link to="/monthly">Monthly Report</Link>
        </nav>

        <header className="App-header">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily" element={<DailyReport />} />
            <Route path="/monthly" element={<MonthlyReport />} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;