const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    service_name: { type: String, required: true },
    total_items: { type: Number, required: true },
    total_price: { type: Number, required: true },
    delivery_charge: { type: Number, required: true },
    pickup_address: { type: String, required: true },
    delivery_option: { type: String, required: true },
    payment_method: { type: String, required: true },
    payment_status: { type: String, default: 'pending' },
    razorpay_order_id: { type: String, default: null },
    razorpay_payment_id: { type: String, default: null },
    pickup_status: { type: String, default: 'pending' },
    drop_status: { type: String, default: 'pending' },
    delivery_details: { type: String, default: '' },
    status: { type: String, default: 'confirmed' },
    items: { type: mongoose.Schema.Types.Mixed, required: true }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('Order', orderSchema);
