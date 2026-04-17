const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'counselor', 'admin'],
        default: 'student'
    },
    speciality: {
        type: String,
        required: false // Only for counselors
    },
    credentials: {
        type: String,
        required: false // Link or text proof for counselors
    },
    isApproved: {
        type: Boolean,
        default: true // Student/Admin approved by default (Admin logic handled in controller)
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
