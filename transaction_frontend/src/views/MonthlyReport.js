import React, { useState, useEffect, useCallback } from 'react';
import transactionsApi from '../api/transactions_api';

// Helper function
const groupTransactionsByMonth = (transactions) => {
  return transactions.reduce((acc, t) => {
    const date = new Date(t.created_at);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const key = `${month} ${year}`;
    
    if (!acc[key]) {
      acc[key] = { year, month, total: 0 };
    }
    acc[key].total += parseFloat(t.amount);
    return acc;
  }, {});
};

function MonthlyReport() {
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyTotal, setYearlyTotal] = useState(0);

  const fetchAllTransactions = useCallback(async () => {
    try {
      const response = await transactionsApi.get('/getTransactions');
      const allTransactions = response.data;

      // Filter for current year
      const currentYear = new Date().getFullYear();
      const thisYearTxs = allTransactions.filter(t => new Date(t.created_at).getFullYear() === currentYear);

      // Calculate yearly total
      const total = thisYearTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      setYearlyTotal(total);

      // Group by month
      const grouped = groupTransactionsByMonth(thisYearTxs);
      setMonthlyData(grouped);
      
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
    }
  }, []);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

return (
    <div>
      <h1>Monthly Report (This Year)</h1>
      <h2>Total This Year: <span style={{color: yearlyTotal >= 0 ? 'green' : 'red'}}>${yearlyTotal.toFixed(2)}</span></h2>
      
      <ul className="transaction-list">
        {Object.values(monthlyData).map(monthData => (
          <li key={monthData.month + monthData.year}> {/* <-- THE FIX IS HERE */}
            <span>{monthData.month} {monthData.year}</span>
            <span style={{ color: monthData.total >= 0 ? 'green' : 'red' }}>
              ${monthData.total.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MonthlyReport;