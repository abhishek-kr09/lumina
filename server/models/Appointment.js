const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // Storing as string or Date object depending on frontend, usually Date is better but string is safer for simple formats. Requirement just says "date". I'll stick to String to avoid easy parsing issues unless forced, or better yet, Date type for flexibility. Let's use Date for better query ability later if needed, but string is flexible. Let's stick to String as "date" and "time" are separate in requirements.
        required: true
    },
    time: {
        type: String,
        required: true
    },
    concern: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
