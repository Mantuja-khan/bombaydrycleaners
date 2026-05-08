const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bombay_dry_cleaners',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then((conn) => {
        console.log('✅ Successfully connected to MySQL Database!');
        conn.release();
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MySQL. Is it running?');
        console.error(err.message);
    });

module.exports = pool;
