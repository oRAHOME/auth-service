const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const mockUserData = require('../models/mockUserData');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const userPayload = { name: profile.displayName, email: profile.emails[0].value };

        const token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);

        return done(null, { user: userPayload, token, refreshToken });
    } catch (err) {
        console.error("Google OAuth error:", err);
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
    
    try {
        const user = await getUserByEmail(email);
        if (user) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        
        res.status(201).json({ message: 'User created', user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'An error has occured' });
    }
};

// Login an existing user
async function login (req, res) {
    const { email, password } = req.body;
    
    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Email does not exist' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
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
    return jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h'
    });
}

// Get a user by email
async function getUserByEmail(email) {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return user.rows[0];
}

module.exports = { googleAuthCallback, register, login, token, logout };