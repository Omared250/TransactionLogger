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


// POST /api/transactions: Create a new transaction


// Start the server
const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  initializeDb(); // Attempt to initialize the DB on start
});