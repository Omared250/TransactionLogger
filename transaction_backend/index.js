const express = require('express');
const cors = require('cors');
const { initializeDb } = require('./database/config.js');

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- DB Connection --- //
initializeDb();

// --- API Endpoints --- //


// GET /api/transactions: Fetch all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/transactions: Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description || amount == null) {
      return res.status(400).json({ msg: 'Please provide description and amount' });
    }
    
    const newTransaction = await pool.query(
      'INSERT INTO transactions (description, amount) VALUES ($1, $2) RETURNING *',
      [description, parseFloat(amount)]
    );
    res.json(newTransaction.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  initializeDb(); // Attempt to initialize the DB on start
});