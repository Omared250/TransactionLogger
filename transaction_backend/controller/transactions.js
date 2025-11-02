
const { pool } = require("../database/config");

const getTransactions = async (req, res) => {
  try {
    // 1. Get the user ID from the header
    const userId = req.header('x-user-id');
    if (!userId) {
      return res.status(401).send('User ID missing');
    }

    // 2. Use the ID in your query
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId] // <-- Pass it as a parameter
    );
    
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createTransactions = async (req, res) => {
    try {
        // 1. Get the user ID from the header
        const userId = req.header('x-user-id');
        if (!userId) {
          return res.status(401).send('User ID missing');
        }

        const { description, amount } = req.body;
        if (!description || amount == null) {
            return res.status(400).json({
                msg: 'Please provide description and amount'
            });
        }

        // 2. Add the user_id to your INSERT statement
        const newTransaction = await pool.query(
            'INSERT INTO transactions (description, amount, user_id) VALUES ($1, $2, $3) RETURNING *',
            [description, parseFloat(amount), userId] // <-- Add it here
        );
        res.json(newTransaction.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { getTransactions, createTransactions };