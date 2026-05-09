const mongoose = require('mongoose');

const pricingItemSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category_id: { type: String, required: true },
    name: { type: String, required: true },
    base_price: { type: Number, default: 0 },
    wash_fold_price: { type: Number, default: null },
    dry_cleaning_price: { type: Number, default: null },
    iron_only_price: { type: Number, default: null },
    premium_care_price: { type: Number, default: null }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('PricingItem', pricingItemSchema);
