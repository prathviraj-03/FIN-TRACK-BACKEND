const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addTransaction, getTransactions, deleteTransaction, downloadReport } = require('../controllers/transactionController');

router.post('/add', auth, addTransaction);
router.get('/', auth, getTransactions); // supports filters via query params
router.delete('/:id', auth, deleteTransaction);
router.get('/download/excel', auth, downloadReport);

module.exports = router;