require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bombay_dry_cleaners');
        console.log(`✅ Successfully connected to MongoDB!`);
        return conn;
    } catch (err) {
        console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
        throw err;
    }
};

module.exports = connectDB;
