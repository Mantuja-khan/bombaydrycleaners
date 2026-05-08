const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { sendOTP, sendWelcomeEmail } = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');

const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        // The frontend useGoogleLogin hook provides an access token.
        // We must fetch the user's profile from Google's UserInfo API.
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            return res.status(400).json({ error: 'Invalid Google Token' });
        }

        const decodedToken = await response.json();
        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ error: 'Google Account missing email' });
        }

        const { email, name, picture } = decodedToken;
        
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        let user;
        
        if (rows.length === 0) {
            // New Google User Sign Up
            const userId = uuidv4();
            const dummyPassword = await bcrypt.hash(uuidv4(), 10);
            await db.query('INSERT INTO users (id, email, password, is_verified) VALUES (?, ?, ?, ?)', [userId, email, dummyPassword, true]);
            await db.query('INSERT INTO profiles (user_id, full_name, avatar_url) VALUES (?, ?, ?)', [userId, name, picture]);
            user = { id: userId, email };
            
            // Send Welcome Email asynchronously
            sendWelcomeEmail(email, name);
        } else {
            user = rows[0];
            // Ensure they are marked verified if they weren't
            if (!user.is_verified) {
                await db.query('UPDATE users SET is_verified = true WHERE id = ?', [user.id]);
            }
        }

        const [profileRows] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
        
        const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
        res.json({ access_token, user: { ...user, profile: profileRows[0] } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const register = async (req, res) => {
    const { email, phone, password, full_name } = req.body;
    try {
        if (phone) {
            const [existingPhone] = await db.query('SELECT * FROM profiles WHERE mobile_number = ?', [phone]);
            if (existingPhone.length > 0) {
                return res.status(400).json({ error: 'This mobile number is already registered' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        
        if (email) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
            const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now

            await db.query(
                'INSERT INTO users (id, email, password, otp, otp_expiry, is_verified) VALUES (?, ?, ?, ?, ?, false)', 
                [userId, email, hashedPassword, otp, otpExpiry]
            );
            await db.query('INSERT INTO profiles (user_id, full_name, mobile_number, is_admin) VALUES (?, ?, ?, false)', [userId, full_name, phone || '']);
            
            // Send email
            await sendOTP(email, otp);
            
            return res.status(201).json({ message: 'OTP sent to email. Please verify.', requires_verification: true, temp_user_id: userId });
        } else {
            // Phone logic
            await db.query('INSERT INTO users (id, phone, password, is_verified) VALUES (?, ?, ?, true)', [userId, phone, hashedPassword]);
            await db.query('INSERT INTO profiles (user_id, full_name, mobile_number, is_admin) VALUES (?, ?, ?, false)', [userId, full_name, phone || '']);
            
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretjwtkey_12345', { expiresIn: 86400 });
            res.status(201).json({ message: 'User created successfully', user: { id: userId, phone }, access_token: token });
        }
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email or phone already exists' });
        res.status(500).json({ error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(404).json({ error: 'User not found' });
        
        const user = rows[0];
        if (user.is_verified) return res.status(400).json({ error: 'User already verified' });
        
        if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
        if (new Date() > new Date(user.otp_expiry)) return res.status(400).json({ error: 'OTP has expired' });
        
        // Verify success
        await db.query('UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE id = ?', [user.id]);
        
        const [profileRows] = await db.query('SELECT full_name FROM profiles WHERE user_id = ?', [user.id]);
        const fullName = profileRows.length > 0 ? profileRows[0].full_name : 'Customer';
        
        sendWelcomeEmail(user.email, fullName);
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretjwtkey_12345', { expiresIn: 86400 });
        res.json({ message: 'Verification successful', user: { id: user.id, email: user.email }, access_token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        let query, values;
        if (email) {
            query = 'SELECT * FROM users WHERE email = ?';
            values = [email];
        } else {
            query = 'SELECT * FROM users WHERE phone = ?';
            values = [phone];
        }
        
        const [rows] = await db.query(query, values);
        if (!rows.length) return res.status(404).json({ error: 'User not found' });
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid password' });
        
        if (email && !user.is_verified) {
             // Generate new OTP
             const otp = Math.floor(100000 + Math.random() * 900000).toString();
             const otpExpiry = new Date(Date.now() + 10 * 60000);
             await db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?', [otp, otpExpiry, user.id]);
             await sendOTP(email, otp);
             return res.status(403).json({ error: 'Please verify your email first. A new OTP has been sent.', requires_verification: true });
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretjwtkey_12345', { expiresIn: 86400 });
        res.json({ message: 'Login successful', user: { id: user.id, email: user.email, phone: user.phone }, access_token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email, phone FROM users WHERE id = ?', [req.userId]);
        const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [req.userId]);
        
        if (!users.length) return res.status(404).json({ error: 'User not found' });
        res.json({ user: users[0], profile: profiles[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { full_name, mobile_number, address } = req.body;
    try {
        await db.query('UPDATE profiles SET full_name = ?, mobile_number = ?, address = ? WHERE user_id = ?', [full_name, mobile_number, address || '', req.userId]);
        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const resetAdminRoute = async (req, res) => {
    try {
        const email = 'bombaydrycleaners@gmail.com';
        const hashedPassword = await bcrypt.hash('bombaydrycleaners@123', 10);
        
        const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            await db.query('UPDATE users SET password = ?, is_verified = true WHERE id = ?', [hashedPassword, rows[0].id]);
            await db.query('UPDATE profiles SET is_admin = true WHERE user_id = ?', [rows[0].id]);
            res.json({ message: 'Admin account successfully reset to defaults!' });
        } else {
            const userId = uuidv4();
            await db.query('INSERT INTO users (id, email, password, is_verified) VALUES (?, ?, ?, ?)', [userId, email, hashedPassword, true]);
            await db.query('INSERT INTO profiles (user_id, full_name, is_admin) VALUES (?, ?, ?)', [userId, 'Admin', true]);
            res.json({ message: 'Admin account successfully seeded!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User with this email does not exist.' });
        }
        
        const user = rows[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now
        
        await db.query('UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?', [otp, otpExpiry, user.id]);
        await sendOTP(email, otp);
        
        res.json({ message: 'OTP sent successfully to your email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        if (!email || !otp || !password) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
        }
        
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        const user = rows[0];
        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP code.' });
        }
        
        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ error: 'OTP has expired.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?', [hashedPassword, user.id]);
        
        res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { googleAuth, register, verifyOtp, login, getMe, updateProfile, resetAdminRoute, forgotPassword, resetPassword };
