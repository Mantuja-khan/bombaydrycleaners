const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const seedAdmin = async () => {
    try {
        const email = 'bombaydrycleaners@gmail.com';
        const user = await User.findOne({ email });
        
        if (!user) {
            const hashedPassword = await bcrypt.hash('bombaydrycleaners@123', 10);
            const userId = uuidv4();
            
            await User.create({
                id: userId,
                email,
                password: hashedPassword,
                is_verified: true,
                profile: {
                    full_name: 'Admin',
                    is_admin: true
                }
            });
            console.log('✅ Admin account seeded successfully!');
        } else {
            // Ensure they are admin
            if (!user.profile || !user.profile.is_admin) {
                user.profile = {
                    ...user.profile,
                    is_admin: true
                };
                await user.save();
                console.log('✅ Admin account status updated!');
            }
        }
    } catch (err) {
        console.error('Failed to seed admin user:', err.message);
    }
};

module.exports = { seedAdmin };
