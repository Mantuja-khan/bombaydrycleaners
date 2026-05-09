const express = require('express');
const router = express.Router();
const PricingCategory = require('../models/PricingCategory');
const PricingItem = require('../models/PricingItem');
const { verifyAdmin } = require('../middlewares/authMiddleware');
const crypto = require('crypto');

router.get('/', async (req, res) => {
    try {
        const categories = await PricingCategory.find().sort({ sort_order: 1 }).lean();
        const items = await PricingItem.find().lean();
        res.json({ categories, items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/items', verifyAdmin, async (req, res) => {
    const { category_id, name, base_price, wash_fold_price, dry_cleaning_price, iron_only_price, premium_care_price } = req.body;
    try {
        const id = crypto.randomUUID();
        const base = parseInt(base_price || wash_fold_price || 0);
        const wf = parseInt(wash_fold_price !== undefined ? wash_fold_price : base);
        const dc = parseInt(dry_cleaning_price !== undefined ? dry_cleaning_price : Math.round(base * 1.8));
        const io = parseInt(iron_only_price !== undefined ? iron_only_price : Math.round(base * 0.6));
        const pc = parseInt(premium_care_price !== undefined ? premium_care_price : Math.round(base * 2.2));

        await PricingItem.create({
            id,
            category_id,
            name,
            base_price: base,
            wash_fold_price: wf,
            dry_cleaning_price: dc,
            iron_only_price: io,
            premium_care_price: pc
        });
        res.json({ message: 'Item added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/items/:id', verifyAdmin, async (req, res) => {
    const { name, base_price, wash_fold_price, dry_cleaning_price, iron_only_price, premium_care_price } = req.body;
    try {
        const item = await PricingItem.findOne({ id: req.params.id });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        const newName = name !== undefined ? name : item.name;
        const base = parseInt(base_price !== undefined ? base_price : item.base_price);
        const wf = parseInt(wash_fold_price !== undefined ? wash_fold_price : (item.wash_fold_price !== null ? item.wash_fold_price : base));
        const dc = parseInt(dry_cleaning_price !== undefined ? dry_cleaning_price : (item.dry_cleaning_price !== null ? item.dry_cleaning_price : Math.round(base * 1.8)));
        const io = parseInt(iron_only_price !== undefined ? iron_only_price : (item.iron_only_price !== null ? item.iron_only_price : Math.round(base * 0.6)));
        const pc = parseInt(premium_care_price !== undefined ? premium_care_price : (item.premium_care_price !== null ? item.premium_care_price : Math.round(base * 2.2)));

        item.name = newName;
        item.base_price = base;
        item.wash_fold_price = wf;
        item.dry_cleaning_price = dc;
        item.iron_only_price = io;
        item.premium_care_price = pc;
        await item.save();

        res.json({ message: 'Price updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/items/:id', verifyAdmin, async (req, res) => {
    try {
        await PricingItem.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
