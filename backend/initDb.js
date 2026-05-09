require('dotenv').config();
const { initDatabase } = require('./utils/initDatabase');
const { seedAdmin } = require('./utils/seedAdmin');
const mongoose = require('mongoose');

const runInit = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bombay_dry_cleaners');
        await initDatabase();
        await seedAdmin();
        console.log('✅ Database successfully initialized and seeded!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    }
};

runInit();
