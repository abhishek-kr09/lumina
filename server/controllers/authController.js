const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret-123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user (Student/Counselor only)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, speciality, credentials } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        // 1. Admin Restriction
        if (role === 'admin') {
            const allowedAdmins = ['abhishek'];
            const lowerName = name.toLowerCase();
            const isAllowed = allowedAdmins.some(admin => lowerName.includes(admin));

            if (!isAllowed) {
                return res.status(403).json({ success: false, message: 'Admin registration is restricted to specific personnel.' });
            }
        }

        // 2. Counselor Validation
        let isApproved = true;
        if (role === 'counselor') {
            if (!speciality || !credentials) {
                return res.status(400).json({ success: false, message: 'Counselors must provide speciality and credentials.' });
            }
            isApproved = false; // Pending approval
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            speciality,
            credentials,
            isApproved
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.role === 'counselor' && !user.isApproved) {
                return res.status(401).json({ success: false, message: 'Your account is pending approval by an administrator.' });
            }

            res.json({
                success: true,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all counselors
// @route   GET /api/auth/counselors
// @access  Public
const getCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: 'counselor', isApproved: true }).select('-password');
        res.status(200).json({ success: true, count: counselors.length, data: counselors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getCounselors,
    getMe
};
