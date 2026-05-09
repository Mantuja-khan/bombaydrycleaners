const { v4: uuidv4 } = require('uuid');
const PricingCategory = require('../models/PricingCategory');
const PricingItem = require('../models/PricingItem');

const initDatabase = async () => {
    try {
        console.log('Checking database collections...');
        const categoryCount = await PricingCategory.countDocuments();
        
        if (categoryCount === 0) {
            console.log('Database empty. Seeding pricing categories and items...');
            
            const categories = [
                { id: '11111111-1111-1111-1111-111111111111', name: 'Daily Wear', icon: '👕', sort_order: 1 },
                { id: '22222222-2222-2222-2222-222222222222', name: 'Traditional / Ethnic', icon: '👗', sort_order: 2 },
                { id: '33333333-3333-3333-3333-333333333333', name: 'Formal Wear', icon: '👔', sort_order: 3 },
                { id: '44444444-4444-4444-4444-444444444444', name: 'Home Items', icon: '🛏️', sort_order: 4 },
                { id: '55555555-5555-5555-5555-555555555555', name: 'Accessories / Others', icon: '👟', sort_order: 5 }
            ];

            await PricingCategory.insertMany(categories);
            console.log('✅ Categories seeded!');

            const rawItems = [
                { category_id: '11111111-1111-1111-1111-111111111111', name: 'Shirt', base_price: 30 },
                { category_id: '11111111-1111-1111-1111-111111111111', name: 'T-shirt', base_price: 25 },
                { category_id: '11111111-1111-1111-1111-111111111111', name: 'Jeans', base_price: 40 },
                { category_id: '11111111-1111-1111-1111-111111111111', name: 'Pants', base_price: 35 },
                { category_id: '11111111-1111-1111-1111-111111111111', name: 'Shorts', base_price: 20 },
                { category_id: '11111111-1111-1111-1111-111111111111', name: 'Kurta', base_price: 35 },
                { category_id: '22222222-2222-2222-2222-222222222222', name: 'Saree', base_price: 80 },
                { category_id: '22222222-2222-2222-2222-222222222222', name: 'Lehenga', base_price: 250 },
                { category_id: '22222222-2222-2222-2222-222222222222', name: 'Suit / Salwar Kameez', base_price: 100 },
                { category_id: '22222222-2222-2222-2222-222222222222', name: 'Sherwani', base_price: 200 },
                { category_id: '22222222-2222-2222-2222-222222222222', name: 'Dupatta', base_price: 40 },
                { category_id: '33333333-3333-3333-3333-333333333333', name: 'Blazer', base_price: 120 },
                { category_id: '33333333-3333-3333-3333-333333333333', name: 'Coat', base_price: 150 },
                { category_id: '33333333-3333-3333-3333-333333333333', name: 'Tie', base_price: 30 },
                { category_id: '33333333-3333-3333-3333-333333333333', name: 'Formal Shirt', base_price: 40 },
                { category_id: '33333333-3333-3333-3333-333333333333', name: 'Trousers', base_price: 45 },
                { category_id: '44444444-4444-4444-4444-444444444444', name: 'Bedsheet', base_price: 60 },
                { category_id: '44444444-4444-4444-4444-444444444444', name: 'Blanket', base_price: 150 },
                { category_id: '44444444-4444-4444-4444-444444444444', name: 'Pillow Cover', base_price: 25 },
                { category_id: '44444444-4444-4444-4444-444444444444', name: 'Curtains', base_price: 100 },
                { category_id: '44444444-4444-4444-4444-444444444444', name: 'Sofa Cover', base_price: 180 },
                { category_id: '55555555-5555-5555-5555-555555555555', name: 'Shoes Cleaning', base_price: 100 },
                { category_id: '55555555-5555-5555-5555-555555555555', name: 'Bags', base_price: 120 },
                { category_id: '55555555-5555-5555-5555-555555555555', name: 'Jackets', base_price: 100 },
                { category_id: '55555555-5555-5555-5555-555555555555', name: 'Woolen Clothes', base_price: 80 }
            ];

            const items = rawItems.map(item => {
                const base = item.base_price;
                return {
                    id: uuidv4(),
                    category_id: item.category_id,
                    name: item.name,
                    base_price: base,
                    wash_fold_price: Math.round(base * 1.0),
                    dry_cleaning_price: Math.round(base * 1.8),
                    iron_only_price: Math.round(base * 0.6),
                    premium_care_price: Math.round(base * 2.2)
                };
            });

            await PricingItem.insertMany(items);
            console.log('✅ Pricing items seeded successfully!');
        } else {
            console.log('✅ Database collections already contain data.');
        }
    } catch (err) {
        console.error('❌ Failed to initialize database schema:', err);
        throw err;
    }
};

module.exports = { initDatabase };
