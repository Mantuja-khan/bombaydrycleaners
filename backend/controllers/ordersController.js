const Order = require('../models/Order');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
    const { service_name, total_items, total_price, delivery_charge, pickup_address, delivery_option, payment_method, items } = req.body;
    try {
        const orderId = uuidv4();
        const initialStatus = payment_method === 'online' ? 'pending' : 'confirmed';
        await Order.create({
            id: orderId,
            user_id: req.userId,
            service_name,
            total_items: parseInt(total_items),
            total_price: parseInt(total_price),
            delivery_charge: parseInt(delivery_charge),
            pickup_address,
            delivery_option,
            payment_method,
            payment_status: 'pending',
            pickup_status: 'pending',
            drop_status: 'pending',
            delivery_details: '',
            status: initialStatus,
            items
        });
        res.status(201).json({ id: orderId, message: 'Order created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        
        const userIds = [...new Set(orders.map(o => o.user_id))];
        const users = await User.find({ id: { $in: userIds } }).lean();
        
        const userMap = users.reduce((acc, u) => {
            acc[u.id] = u.profile || {};
            return acc;
        }, {});

        const parsedOrders = orders.map(o => {
            const profile = userMap[o.user_id] || {};
            return {
                ...o,
                full_name: profile.full_name || '',
                mobile_number: profile.mobile_number || ''
            };
        });

        res.json(parsedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status, payment_status, pickup_status, drop_status, delivery_details } = req.body;
    try {
        const updateFields = {};
        if (status !== undefined) updateFields.status = status;
        if (payment_status !== undefined) updateFields.payment_status = payment_status;
        if (pickup_status !== undefined) updateFields.pickup_status = pickup_status;
        if (drop_status !== undefined) updateFields.drop_status = drop_status;
        if (delivery_details !== undefined) updateFields.delivery_details = delivery_details;

        await Order.findOneAndUpdate({ id: req.params.id }, updateFields);
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.userId }).sort({ createdAt: -1 }).lean();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createOrder, getOrders, updateOrderStatus, getMyOrders };
