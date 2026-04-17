const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getBookedSlots,
    getMyAppointments,
    getCounselorAppointments,
    updateAppointmentStatus
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Student routes
router.post('/book', protect, restrictTo('student'), bookAppointment);
router.get('/booked-slots', protect, restrictTo('student'), getBookedSlots);
router.get('/my', protect, restrictTo('student'), getMyAppointments);

// Counselor routes
router.get('/counselor', protect, restrictTo('counselor'), getCounselorAppointments);
router.patch('/:id/status', protect, restrictTo('counselor'), updateAppointmentStatus);

module.exports = router;
