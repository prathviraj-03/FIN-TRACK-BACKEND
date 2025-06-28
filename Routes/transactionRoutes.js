const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

router.post('/add', addTransaction);
router.get('/', getTransactions); // supports filters via query params

// Use the controller for deletion
router.delete('/:id', deleteTransaction);

module.exports = router;