const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getAllAppointments,
    deleteUser,
    getStats,
    getPendingCounselors,
    approveCounselor,
    rejectCounselor
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All routes are protected and restricted to admin
router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);
router.delete('/user/:id', deleteUser);
router.get('/stats', getStats);
router.get('/pending-counselors', getPendingCounselors);
router.patch('/approve-counselor/:id', approveCounselor);
router.delete('/reject-counselor/:id', rejectCounselor);

module.exports = router;
