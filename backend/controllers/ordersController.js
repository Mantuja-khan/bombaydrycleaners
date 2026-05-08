const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
    const { service_name, total_items, total_price, delivery_charge, pickup_address, delivery_option, payment_method, items } = req.body;
    try {
        const orderId = uuidv4();
        await db.query(
            'INSERT INTO orders (id, user_id, service_name, total_items, total_price, delivery_charge, pickup_address, delivery_option, payment_method, status, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [orderId, req.userId, service_name, total_items, total_price, delivery_charge, pickup_address, delivery_option, payment_method, 'confirmed', JSON.stringify(items)]
        );
        res.status(201).json({ id: orderId, message: 'Order created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, p.full_name, p.mobile_number 
            FROM orders o 
            LEFT JOIN profiles p ON o.user_id = p.user_id 
            ORDER BY o.created_at DESC
        `);
        const parsedOrders = orders.map(o => {
            o.items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            return o;
        });
        res.json(parsedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.userId]
        );
        const parsedOrders = orders.map(o => {
            o.items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            return o;
        });
        res.json(parsedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus, getMyOrders };
