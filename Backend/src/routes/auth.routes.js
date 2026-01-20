const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleCallback } = require('../controllers/auth.controller');
const passport = require('passport');

router.post('/signup', signup);
router.post('/login', login);

const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })); // Added prompt to force selector

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${frontendURL}/login` }),
    googleCallback
);

module.exports = router;
