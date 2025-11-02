const { Router } = require('express');
const { getTransactions, createTransactions } = require('../controller/transactions.js');
const router = Router();

// getting all transactions
router.get('getTransactions', getTransactions);

// creating transactions
router.post('createTransactions', createTransactions);