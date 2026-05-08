require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./config/db');

const initDb = async () => {
    try {
        console.log('Reading schema...');
        const schemaPath = path.join(__dirname, 'models', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split statements by semicolon, but filter out empty ones
        const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

        console.log('Executing schema...');
        for (let statement of statements) {
            await db.query(statement);
        }
        
        console.log('✅ Database tables initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    }
};

initDb();
