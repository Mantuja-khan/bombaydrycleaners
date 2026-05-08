require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pricingRoutes = require('./routes/pricing');
const orderRoutes = require('./routes/orders');
const { seedAdmin } = require('./utils/seedAdmin');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Seed the admin user bombaydrycleaners@gmail.com
    await seedAdmin();
});
