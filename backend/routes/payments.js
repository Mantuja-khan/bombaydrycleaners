const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { verifyToken } = require('../middlewares/authMiddleware');

// Get Razorpay Key ID
router.get('/key', verifyToken, (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID || '' });
});

// Create Razorpay Order
router.post('/order', verifyToken, async (req, res) => {
    const { amount, orderId } = req.body;
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: "Razorpay credentials not configured on server" });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const cleanId = String(orderId || '').replace(/-/g, '').slice(0, 30);
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `rcpt_${cleanId}`
        };

        const rzpOrder = await razorpay.orders.create(options);
        
        // Update local order with the Razorpay order ID
        await Order.findOneAndUpdate({ id: orderId }, { razorpay_order_id: rzpOrder.id });

        res.json({
            id: rzpOrder.id,
            currency: rzpOrder.currency,
            amount: rzpOrder.amount
        });
    } catch (err) {
        console.error('Razorpay order creation error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Verify Razorpay Payment Signature
router.post('/verify', verifyToken, async (req, res) => {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: "Razorpay secret not configured on server" });
        }

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is successful, update order details
            await Order.findOneAndUpdate(
                { id: orderId },
                {
                    payment_status: 'paid',
                    status: 'confirmed',
                    razorpay_payment_id: razorpay_payment_id
                }
            );
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            await Order.findOneAndUpdate({ id: orderId }, { payment_status: 'failed' });
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
