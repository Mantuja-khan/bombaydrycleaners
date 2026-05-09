require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secretkey');
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized!' });
    }
};

const verifyAdmin = async (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const user = await User.findOne({ id: req.userId });
            if (user && user.profile && user.profile.is_admin) {
                next();
            } else {
                res.status(403).json({ error: 'Require Admin Role!' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
