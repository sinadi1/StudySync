const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth.js');
const connectDB = require('./config/db.js');

const app = express();
app.use(cors());

connectDB();
app.use(express.json()); 

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Accountability API is humming along smoothly.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', require('./routes/subject'));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});