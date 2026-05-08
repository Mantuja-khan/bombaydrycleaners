const jwt = require('jsonwebtoken');

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
        const db = require('./db');
        const [rows] = await db.query('SELECT is_admin FROM profiles WHERE user_id = ?', [req.userId]);
        if (rows.length && rows[0].is_admin) {
            next();
        } else {
            res.status(403).json({ error: 'Require Admin Role!' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
