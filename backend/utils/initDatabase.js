const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const initDatabase = async () => {
    try {
        console.log('Checking database tables...');
        const [tables] = await db.query("SHOW TABLES LIKE 'users'");
        
        if (tables.length === 0) {
            console.log('Tables do not exist. Initializing database schema...');
            const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');

            // Split statements by semicolon, but filter out empty ones
            const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

            console.log(`Executing ${statements.length} schema statements...`);
            for (let statement of statements) {
                await db.query(statement);
            }
            console.log('✅ Database tables initialized successfully!');
        } else {
            console.log('✅ Database tables already exist.');
        }
    } catch (err) {
        console.error('❌ Failed to initialize database schema:', err);
        throw err;
    }
};

module.exports = { initDatabase };
