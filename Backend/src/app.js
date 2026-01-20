const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const passport = require('passport');
require('./config/passport'); // Import passport configuration

const app = express();

app.use(passport.initialize());


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes); // Keep for existing API compatibility
app.use("/auth", authRoutes);     // Add for Google Console compatibility

app.get('/', (req, res) => {
  res.send("AI ChatBot API is running...");
});

module.exports = app;