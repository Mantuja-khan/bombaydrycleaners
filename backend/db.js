const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
