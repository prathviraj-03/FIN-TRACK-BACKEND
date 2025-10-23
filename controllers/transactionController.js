const Transaction = require('../models/Transaction');
const ExcelJS = require('exceljs');

exports.addTransaction = async (req, res) => {
  try {
    const payload = { ...req.body, user: req.user._id };
    const transaction = new Transaction(payload);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = { user: req.user._id };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found or not authorized' });
    }
    res.json({ message: 'Transaction deleted', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Generate and send Excel report of user's transactions
exports.downloadReport = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Transactions');

    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 }
    ];

    transactions.forEach((t) => {
      sheet.addRow({ date: t.date.toISOString(), type: t.type, category: t.category, amount: t.amount });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Could not generate report', error: err.message });
  }
};