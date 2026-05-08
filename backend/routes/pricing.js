const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyAdmin } = require('../middlewares/authMiddleware');
const crypto = require('crypto');

// Ensure schema is updated with individual prices columns on startup
async function ensureSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM pricing_items');
        const columnNames = columns.map(c => c.Field);
        
        let altered = false;
        if (!columnNames.includes('wash_fold_price')) {
            await db.query('ALTER TABLE pricing_items ADD COLUMN wash_fold_price INT DEFAULT NULL');
            altered = true;
        }
        if (!columnNames.includes('dry_cleaning_price')) {
            await db.query('ALTER TABLE pricing_items ADD COLUMN dry_cleaning_price INT DEFAULT NULL');
            altered = true;
        }
        if (!columnNames.includes('iron_only_price')) {
            await db.query('ALTER TABLE pricing_items ADD COLUMN iron_only_price INT DEFAULT NULL');
            altered = true;
        }
        if (!columnNames.includes('premium_care_price')) {
            await db.query('ALTER TABLE pricing_items ADD COLUMN premium_care_price INT DEFAULT NULL');
            altered = true;
        }
        
        if (altered) {
            console.log('Columns added to pricing_items. Initializing values...');
        }
        
        // Always verify and populate if null
        const [items] = await db.query('SELECT * FROM pricing_items');
        for (let item of items) {
            if (item.wash_fold_price === null || item.dry_cleaning_price === null || item.iron_only_price === null || item.premium_care_price === null) {
                const wash_fold = item.wash_fold_price !== null ? item.wash_fold_price : Math.round(item.base_price * 1.0);
                const dry_cleaning = item.dry_cleaning_price !== null ? item.dry_cleaning_price : Math.round(item.base_price * 1.8);
                const iron_only = item.iron_only_price !== null ? item.iron_only_price : Math.round(item.base_price * 0.6);
                const premium_care = item.premium_care_price !== null ? item.premium_care_price : Math.round(item.base_price * 2.2);
                
                await db.query(
                    'UPDATE pricing_items SET wash_fold_price = ?, dry_cleaning_price = ?, iron_only_price = ?, premium_care_price = ? WHERE id = ?',
                    [wash_fold, dry_cleaning, iron_only, premium_care, item.id]
                );
            }
        }
        if (altered) {
            console.log('✅ Schema migration for pricing_items completed successfully!');
        }
    } catch (err) {
        console.error('Error ensuring pricing schema:', err);
    }
}
ensureSchema();

router.get('/', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM pricing_categories ORDER BY sort_order');
        const [items] = await db.query('SELECT * FROM pricing_items');
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

        await db.query(
            'INSERT INTO pricing_items (id, category_id, name, base_price, wash_fold_price, dry_cleaning_price, iron_only_price, premium_care_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, category_id, name, base, wf, dc, io, pc]
        );
        res.json({ message: 'Item added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/items/:id', verifyAdmin, async (req, res) => {
    const { name, base_price, wash_fold_price, dry_cleaning_price, iron_only_price, premium_care_price } = req.body;
    try {
        const [existing] = await db.query('SELECT * FROM pricing_items WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        const item = existing[0];
        const newName = name !== undefined ? name : item.name;
        const base = parseInt(base_price !== undefined ? base_price : item.base_price);
        const wf = parseInt(wash_fold_price !== undefined ? wash_fold_price : (item.wash_fold_price !== null ? item.wash_fold_price : base));
        const dc = parseInt(dry_cleaning_price !== undefined ? dry_cleaning_price : (item.dry_cleaning_price !== null ? item.dry_cleaning_price : Math.round(base * 1.8)));
        const io = parseInt(iron_only_price !== undefined ? iron_only_price : (item.iron_only_price !== null ? item.iron_only_price : Math.round(base * 0.6)));
        const pc = parseInt(premium_care_price !== undefined ? premium_care_price : (item.premium_care_price !== null ? item.premium_care_price : Math.round(base * 2.2)));

        await db.query(
            'UPDATE pricing_items SET name = ?, base_price = ?, wash_fold_price = ?, dry_cleaning_price = ?, iron_only_price = ?, premium_care_price = ? WHERE id = ?',
            [newName, base, wf, dc, io, pc, req.params.id]
        );
        res.json({ message: 'Price updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/items/:id', verifyAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM pricing_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
