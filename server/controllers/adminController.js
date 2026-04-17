const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('userId', 'name email')
            .populate('counselorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin' });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const counselorCount = await User.countDocuments({ role: 'counselor' });
        const appointmentCount = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const pendingCounselors = await User.countDocuments({ role: 'counselor', isApproved: false });

        res.status(200).json({
            success: true,
            data: {
                students: studentCount,
                counselors: counselorCount,
                appointments: appointmentCount,
                pending: pendingAppointments,
                pendingCounselors // Added new stat
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get pending counselors
// @route   GET /api/admin/pending-counselors
// @access  Private (Admin)
const getPendingCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor', isApproved: false }).select('-password');
        res.status(200).json({ success: true, count: counselors.length, data: counselors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Approve counselor
// @route   PATCH /api/admin/approve-counselor/:id
// @access  Private (Admin)
const approveCounselor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || user.role !== 'counselor') {
            return res.status(404).json({ success: false, message: 'Counselor not found' });
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({ success: true, message: 'Counselor approved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reject counselor (Delete)
// @route   DELETE /api/admin/reject-counselor/:id
// @access  Private (Admin)
const rejectCounselor = async (req, res) => {
    // Reusing delete logic but semantic difference
    return deleteUser(req, res);
};


module.exports = {
    getAllUsers,
    getAllAppointments,
    deleteUser,
    getStats,
    getPendingCounselors,
    approveCounselor,
    rejectCounselor
};
