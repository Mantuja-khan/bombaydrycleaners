const mongoose = require('mongoose');

const pricingCategorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: '' },
    sort_order: { type: Number, default: 0 }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('PricingCategory', pricingCategorySchema);
