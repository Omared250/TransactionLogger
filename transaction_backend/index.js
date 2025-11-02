const express = require('express');
const cors = require('cors');
const { initializeDb } = require('./database/config.js');
require('dotenv').config();

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- DB Connection --- //
initializeDb();

// --- API Endpoints --- //
app.use('/api', require('./routes/transactions_endpoints.js'));

// Start the server
const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});