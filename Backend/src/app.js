const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const passport = require('passport');
require('./config/passport'); // Import passport configuration

const app = express();

app.enable('trust proxy');
app.use(passport.initialize());


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes); // Keep for existing API compatibility
app.use("/auth", authRoutes);     // Add for Google Console compatibility

app.use(express.static(path.join(__dirname, "../public")));

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;