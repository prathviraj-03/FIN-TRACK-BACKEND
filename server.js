const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const transactionRoutes = require('./Routes/transactionRoutes');
const app = express();
connectDB(); // connect to MongoDB

app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
