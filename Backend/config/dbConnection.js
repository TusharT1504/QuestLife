// Database connection
console.log('Connecting to MongoDB...');
const mongoose = require('mongoose');
require('dotenv').config();

function connectDB() {
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => {
        console.error(' MongoDB connection error:', err);
        throw err;
    });
}

module.exports = connectDB;
