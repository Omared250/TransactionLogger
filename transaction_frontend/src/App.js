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