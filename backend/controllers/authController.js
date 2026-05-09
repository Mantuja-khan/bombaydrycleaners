require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { sendOTP, sendWelcomeEmail } = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');

const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        // Fetch the user's profile from Google's UserInfo API.
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
        
        let user = await User.findOne({ email });
        
        if (!user) {
            // New Google User Sign Up
            const userId = uuidv4();
            const dummyPassword = await bcrypt.hash(uuidv4(), 10);
            
            user = await User.create({
                id: userId,
                email,
                password: dummyPassword,
                is_verified: true,
                profile: {
                    full_name: name,
                    avatar_url: picture,
                    is_admin: false
                }
            });
            
            // Send Welcome Email asynchronously
            sendWelcomeEmail(email, name);
        } else {
            // Ensure they are marked verified if they weren't
            if (!user.is_verified) {
                user.is_verified = true;
                await user.save();
            }
        }

        const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });
        res.json({ access_token, user: { id: user.id, email: user.email, profile: user.profile } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const register = async (req, res) => {
    const { email, phone, password, full_name } = req.body;
    try {
        if (phone) {
            const existingPhone = await User.findOne({ 'profile.mobile_number': phone });
            if (existingPhone) {
                return res.status(400).json({ error: 'This mobile number is already registered' });
            }
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        
        if (email) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
            const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now

            await User.create({
                id: userId,
                email,
                password: hashedPassword,
                otp,
                otp_expiry: otpExpiry,
                is_verified: false,
                profile: {
                    full_name,
                    mobile_number: phone || '',
                    is_admin: false
                }
            });
            
            // Send email
            await sendOTP(email, otp);
            
            return res.status(201).json({ message: 'OTP sent to email. Please verify.', requires_verification: true, temp_user_id: userId });
        } else {
            // Phone logic
            await User.create({
                id: userId,
                phone,
                password: hashedPassword,
                is_verified: true,
                profile: {
                    full_name,
                    mobile_number: phone,
                    is_admin: false
                }
            });
            
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretjwtkey_12345', { expiresIn: 86400 });
            res.status(201).json({ message: 'User created successfully', user: { id: userId, phone }, access_token: token });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        if (user.is_verified) return res.status(400).json({ error: 'User already verified' });
        
        if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
        if (new Date() > new Date(user.otp_expiry)) return res.status(400).json({ error: 'OTP has expired' });
        
        // Verify success
        user.is_verified = true;
        user.otp = null;
        user.otp_expiry = null;
        await user.save();
        
        const fullName = user.profile && user.profile.full_name ? user.profile.full_name : 'Customer';
        
        sendWelcomeEmail(user.email, fullName);
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretjwtkey_12345', { expiresIn: 86400 });
        res.json({ message: 'Verification successful', user: { id: user.id, email: user.email }, access_token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { email, phone, password } = req.body;
    try {
        let user;
        if (email) {
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ phone });
        }
        
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid password' });
        
        if (email && !user.is_verified) {
             // Generate new OTP
             const otp = Math.floor(100000 + Math.random() * 900000).toString();
             const otpExpiry = new Date(Date.now() + 10 * 60000);
             user.otp = otp;
             user.otp_expiry = otpExpiry;
             await user.save();
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
        const user = await User.findOne({ id: req.userId }, 'id email phone profile');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: { id: user.id, email: user.email, phone: user.phone }, profile: user.profile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { full_name, mobile_number, address } = req.body;
    try {
        const user = await User.findOne({ id: req.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.profile = {
            ...user.profile,
            full_name: full_name !== undefined ? full_name : user.profile.full_name,
            mobile_number: mobile_number !== undefined ? mobile_number : user.profile.mobile_number,
            address: address !== undefined ? address : user.profile.address
        };
        await user.save();
        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const resetAdminRoute = async (req, res) => {
    try {
        const email = 'bombaydrycleaners@gmail.com';
        const hashedPassword = await bcrypt.hash('bombaydrycleaners@123', 10);
        
        let user = await User.findOne({ email });
        if (user) {
            user.password = hashedPassword;
            user.is_verified = true;
            user.profile = {
                ...user.profile,
                is_admin: true
            };
            await user.save();
            res.json({ message: 'Admin account successfully reset to defaults!' });
        } else {
            const userId = uuidv4();
            await User.create({
                id: userId,
                email,
                password: hashedPassword,
                is_verified: true,
                profile: {
                    full_name: 'Admin',
                    is_admin: true
                }
            });
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
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist.' });
        }
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes from now
        
        user.otp = otp;
        user.otp_expiry = otpExpiry;
        await user.save();
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
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP code.' });
        }
        
        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ error: 'OTP has expired.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otp_expiry = null;
        await user.save();
        
        res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { googleAuth, register, verifyOtp, login, getMe, updateProfile, resetAdminRoute, forgotPassword, resetPassword };
