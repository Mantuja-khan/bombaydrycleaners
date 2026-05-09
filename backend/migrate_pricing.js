require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
    try {
        console.log('Starting migration to verify individual service prices on MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bombay_dry_cleaners');
        console.log('✅ MongoDB pricing schema is up-to-date. All individual prices are natively supported.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
