const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const transactionRoutes = require('./Routes/transactionRoutes');
const authRoutes = require('./Routes/authRoutes');
const app = express();
connectDB(); // connect to MongoDB

// Ensure JWT secret is set
if (!process.env.JWT_SECRET) {
	console.error('❌ JWT_SECRET is not set in .env. Please set JWT_SECRET to a strong random string.');
	process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Expense tracker backend' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
