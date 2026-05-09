const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    otp_expiry: { type: Date, default: null },
    is_verified: { type: Boolean, default: false },
    profile: {
        full_name: { type: String, default: '' },
        mobile_number: { type: String, default: '' },
        address: { type: String, default: '' },
        avatar_url: { type: String, default: '' },
        is_admin: { type: Boolean, default: false }
    }
}, { 
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } 
});

module.exports = mongoose.model('User', userSchema);
