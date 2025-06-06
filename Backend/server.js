require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const connectDB = require('./config/dbConnection');
const authRoutes = require('./routes/authRoute');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

connectDB();

app.use('/api/auth', authRoutes);
// app.use('/api/tasks');
// app.use('/api/profile');
// app.use('/api/marketplace');
// app.use('/api/logs');


app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    Server is running at Port: ${PORT}
    `);
}); 