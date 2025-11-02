import React, { useState, useEffect, useCallback } from 'react';
import transactionsApi from '../api/transactions_api';

// Helper function to group and sum transactions
const groupTransactionsByDay = (transactions) => {
  return transactions.reduce((acc, t) => {
    const date = new Date(t.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { transactions: [], total: 0 };
    }
    acc[date].transactions.push(t);
    acc[date].total += parseFloat(t.amount);
    return acc;
  }, {});
};

function DailyReport() {
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const fetchAllTransactions = useCallback(async () => {
    try {
      const response = await transactionsApi.get('/getTransactions');
      const allTransactions = response.data;
      
      // Filter for current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthTxs = allTransactions.filter(t => {
        const txDate = new Date(t.created_at);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      });

      // Calculate monthly total
      const total = thisMonthTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      setMonthlyTotal(total);

      // Group by day
      const grouped = groupTransactionsByDay(thisMonthTxs);
      setGroupedTransactions(grouped);
      
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
    }
  }, []);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  return (
    <div>
      <h1>Daily Report (This Month)</h1>
      <h2>Total This Month: <span style={{color: monthlyTotal >= 0 ? 'green' : 'red'}}>${monthlyTotal.toFixed(2)}</span></h2>
      
      {Object.keys(groupedTransactions).sort((a,b) => new Date(b) - new Date(a)).map(date => (
        <div key={date} style={{ marginBottom: '20px' }}>
          <h3>{date} (Total: ${groupedTransactions[date].total.toFixed(2)})</h3>
          <ul className="transaction-list">
            {groupedTransactions[date].transactions.map(t => (
              <li key={t.id}>
                <span>{t.description}</span>
                <span style={{ color: t.amount >= 0 ? 'green' : 'red' }}>
                  ${t.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default DailyReport;