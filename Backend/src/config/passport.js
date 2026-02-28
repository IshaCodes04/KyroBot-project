const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                return done(null, user);
            }

            // If not, create new user
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                password: randomPassword, // we should hash this, but the model hook does it
                // You might want to add a field like 'authProvider: "google"' in schema later
            });

            return done(null, user);

        } catch (error) {
            return done(error, null);
        }
    }
));

module.exports = passport;
