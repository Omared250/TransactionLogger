const { pool } = require("../database/config");

const getTransactions = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const createTransactions = async (req, res) => {
    try {
        const {
            description,
            amount
        } = req.body;
        if (!description || amount == null) {
            return res.status(400).json({
                msg: 'Please provide description and amount'
            });
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
};

module.exports = { getTransactions, createTransactions };