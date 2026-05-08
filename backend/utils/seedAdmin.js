const db = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const seedAdmin = async () => {
    try {
        const email = 'bombaydrycleaners@gmail.com';
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('bombaydrycleaners@123', 10);
            const userId = uuidv4();
            
            await db.query('INSERT INTO users (id, email, password, is_verified) VALUES (?, ?, ?, ?)', [userId, email, hashedPassword, true]);
            await db.query('INSERT INTO profiles (user_id, full_name, is_admin) VALUES (?, ?, ?)', [userId, 'Admin', true]);
            console.log('✅ Admin account seeded successfully!');
        } else {
            // Ensure they are admin
            await db.query('UPDATE profiles SET is_admin = true WHERE user_id = ?', [rows[0].id]);
        }
    } catch (err) {
        console.error('Failed to seed admin user:', err.message);
    }
};

module.exports = { seedAdmin };
