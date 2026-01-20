const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleCallback } = require('../controllers/auth.controller');
const passport = require('passport');

router.post('/signup', signup);
router.post('/login', login);

// Google Auth Routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    // Force Google to re-show the consent screen + account chooser
    prompt: 'consent select_account',
    // Request refresh token (Google typically only returns it on first consent; prompt=consent helps)
    accessType: 'offline',
    includeGrantedScopes: true
  })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;
