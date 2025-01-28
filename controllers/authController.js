const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mockUserData = require('../models/mockUserData');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists in database, change with actual database later
        let user = mockUserData.find(user => user.email === profile.emails[0].value);
        // Generate JWT instead of using sessions
        if (!user) {
            user = {
                name: profile.displayName,
                email: profile.emails[0].value,
                devices: []
            }
            mockUserData.push(user);
        }
        const userPayload = { name: user.name, email: user.email };

        const token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);

        return done(null, { user, token, refreshToken });
    } catch (err) {
        return done(err, null);
    }
}));

// Temporary storage for refresh tokens
let tempTokens = [];

// Google OAuth callback
function googleAuthCallback (req, res) {
    if (!req.user) {
        return res.status(401).json({ message: 'OAuth login failed' });
    }

    res.json({
        message: "Login successful",
        accessToken: req.user.token,
        user: req.user.user
    });
};


// Register a new user
async function register (req, res) {
    const { username, email, password, devices } = req.body;
    const existingUser = mockUserData.find(user => user.email === email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        mockUserData.push({ name: username, hashedPassword, devices });
        res.status(201).json({ message: 'User created' });
    } catch {
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Login an existing user
async function login (req, res) {
    const { username, email, password } = req.body;
    const user = mockUserData.find(user => user.email === email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    try {
        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect credentials' });

        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET);
        tempTokens.push(refreshToken);

        res.json({ accessToken, refreshToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Generate a new access token using a refresh token
function token (req, res) {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if (!tempTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken });
    });
};

// Logout a user
function logout (req, res) {
    // Remove the refresh token from the database later 
    tempTokens = tempTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
};

// Helper functions
// Generate an access token
function generateAccessToken(user) {
    return jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

module.exports = { googleAuthCallback, register, login, token, logout };