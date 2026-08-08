require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initDatabase } = require('./utils/initDatabase');

const app = express();

const allowedOrigins = [
    'https://bombaydrycleaners.com',
    'https://www.bombaydrycleaners.com',
    'https://api.bombaydrycleaners.com',
    'http://localhost:8080',
    'http://localhost:7004'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 7004;

async function startServer() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Initialize database tables if they do not exist
        await initDatabase();

        // Load and register routes after database is ready
        const authRoutes = require('./routes/auth');
        const pricingRoutes = require('./routes/pricing');
        const orderRoutes = require('./routes/orders');
        const paymentRoutes = require('./routes/payments');
        const { seedAdmin } = require('./utils/seedAdmin');

        app.use('/api/auth', authRoutes);
        app.use('/api/pricing', pricingRoutes);
        app.use('/api/orders', orderRoutes);
        app.use('/api/payments', paymentRoutes);

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

