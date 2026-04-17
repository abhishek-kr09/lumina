const Appointment = require('../models/Appointment');
const User = require('../models/User');

const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

// @desc    Book an appointment (Student only)
// @route   POST /api/appointment/book
// @access  Private (Student)
const bookAppointment = async (req, res) => {
    try {
        const { counselorId, date, time, concern, contactPhone, anonymous } = req.body;

        if (!counselorId || !date || !time || !concern || !contactPhone) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        if (!PHONE_REGEX.test(contactPhone) || contactPhone.replace(/\D/g, '').length < 10) {
            return res.status(400).json({ success: false, message: 'Please add a valid contact phone number' });
        }

        // Verify counselor exists and is actually a counselor
        const counselor = await User.findById(counselorId);
        if (!counselor || counselor.role !== 'counselor') {
            return res.status(400).json({ success: false, message: 'Invalid counselor' });
        }

        // Prevent double booking for the same counselor slot.
        // Rejected appointments do not block a slot.
        const conflictingAppointment = await Appointment.findOne({
            counselorId,
            date,
            time,
            status: { $in: ['pending', 'approved'] },
        });

        if (conflictingAppointment) {
            return res.status(409).json({
                success: false,
                message: 'This counselor is already booked for the selected date and time. Please choose another slot.',
            });
        }

        const appointment = await Appointment.create({
            userId: req.user.id,
            counselorId,
            date,
            time,
            concern,
            contactPhone: contactPhone.trim(),
            isPrivate: Boolean(anonymous),
            status: 'pending'
        });

        res.status(201).json({ success: true, data: appointment });
    } catch (error) {
        // If a unique slot index is added in future, keep this response user-friendly.
        if (error?.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This counselor is already booked for the selected date and time. Please choose another slot.',
            });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get booked slots for a counselor on a date
// @route   GET /api/appointment/booked-slots?counselorId=...&date=...
// @access  Private (Student)
const getBookedSlots = async (req, res) => {
    try {
        const { counselorId, date } = req.query;

        if (!counselorId || !date) {
            return res.status(400).json({ success: false, message: 'counselorId and date are required' });
        }

        const counselor = await User.findById(counselorId);
        if (!counselor || counselor.role !== 'counselor') {
            return res.status(400).json({ success: false, message: 'Invalid counselor' });
        }

        const appointments = await Appointment.find({
            counselorId,
            date,
            status: { $in: ['pending', 'approved'] },
        }).select('time -_id');

        const bookedTimes = appointments.map((apt) => apt.time);

        return res.status(200).json({
            success: true,
            data: {
                counselorId,
                date,
                bookedTimes,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my appointments (Student only)
// @route   GET /api/appointment/my
// @access  Private (Student)
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user.id })
            .populate('counselorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get appointments for logged-in counselor
// @route   GET /api/appointment/counselor
// @access  Private (Counselor)
const getCounselorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ counselorId: req.user.id })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update appointment status (Counselor only)
// @route   PATCH /api/appointment/:id/status
// @access  Private (Counselor)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['approved', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        let appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Ensure appointment belongs to this counselor
        if (appointment.counselorId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this appointment' });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    bookAppointment,
    getBookedSlots,
    getMyAppointments,
    getCounselorAppointments,
    updateAppointmentStatus
};
