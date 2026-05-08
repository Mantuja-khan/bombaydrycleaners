require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./utils/initDatabase');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7004;

async function startServer() {
    try {
        // Initialize database tables if they do not exist
        await initDatabase();

        // Load and register routes after database is ready
        const authRoutes = require('./routes/auth');
        const pricingRoutes = require('./routes/pricing');
        const orderRoutes = require('./routes/orders');
        const { seedAdmin } = require('./utils/seedAdmin');

        app.use('/api/auth', authRoutes);
        app.use('/api/pricing', pricingRoutes);
        app.use('/api/orders', orderRoutes);

        app.listen(PORT, async () => {
            console.log(`🚀 Server running on port ${PORT}`);
            // Seed the admin user bombaydrycleaners@gmail.com
            await seedAdmin();
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

startServer();

