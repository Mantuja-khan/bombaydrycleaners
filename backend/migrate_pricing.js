const db = require('./config/db');

async function migrate() {
    try {
        console.log('Starting migration to add individual service prices...');
        
        // Check columns
        const [columns] = await db.query('SHOW COLUMNS FROM pricing_items');
        const columnNames = columns.map(c => c.Field);
        
        if (!columnNames.includes('wash_fold_price')) {
            console.log('Adding wash_fold_price column...');
            await db.query('ALTER TABLE pricing_items ADD COLUMN wash_fold_price INT DEFAULT NULL');
        }
        if (!columnNames.includes('dry_cleaning_price')) {
            console.log('Adding dry_cleaning_price column...');
            await db.query('ALTER TABLE pricing_items ADD COLUMN dry_cleaning_price INT DEFAULT NULL');
        }
        if (!columnNames.includes('iron_only_price')) {
            console.log('Adding iron_only_price column...');
            await db.query('ALTER TABLE pricing_items ADD COLUMN iron_only_price INT DEFAULT NULL');
        }
        if (!columnNames.includes('premium_care_price')) {
            console.log('Adding premium_care_price column...');
            await db.query('ALTER TABLE pricing_items ADD COLUMN premium_care_price INT DEFAULT NULL');
        }
        
        console.log('Initializing column values based on base_price multipliers...');
        // Update any rows where the new columns are NULL
        const [items] = await db.query('SELECT * FROM pricing_items');
        for (let item of items) {
            const wash_fold = item.wash_fold_price !== null ? item.wash_fold_price : Math.round(item.base_price * 1.0);
            const dry_cleaning = item.dry_cleaning_price !== null ? item.dry_cleaning_price : Math.round(item.base_price * 1.8);
            const iron_only = item.iron_only_price !== null ? item.iron_only_price : Math.round(item.base_price * 0.6);
            const premium_care = item.premium_care_price !== null ? item.premium_care_price : Math.round(item.base_price * 2.2);
            
            await db.query(
                'UPDATE pricing_items SET wash_fold_price = ?, dry_cleaning_price = ?, iron_only_price = ?, premium_care_price = ? WHERE id = ?',
                [wash_fold, dry_cleaning, iron_only, premium_care, item.id]
            );
        }
        
        console.log('✅ Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
