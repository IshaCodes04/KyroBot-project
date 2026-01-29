const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Google Auth Callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = (req, res) => {
    // Generate token
    const token = generateToken(req.user._id);

    // Prepare user data
    const userData = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email
    };

    // Redirect to frontend with token and user data
    // Redirect to frontend with token and user data
    // In production (Render), we are on the same domain, so we can redirect to root
    const isProduction = process.env.NODE_ENV === 'production';
    const frontendURL = isProduction ? '/' : 'http://localhost:5173';

    res.redirect(`${frontendURL}?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
};
