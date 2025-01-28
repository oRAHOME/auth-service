const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mockUserData = require('../models/mockUserData');

// Temporary storage for refresh tokens
let tempTokens = [];

async function register (req, res) {
    const { username, password, devices } = req.body;
    const existingUser = findUser(username);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        mockUserData.push({ name: username, hashedPassword, devices });
        res.status(201).json({ message: 'User created' });
    } catch {
        res.status(500).json({ message: 'Error creating user' });
    }
};

async function login (req, res) {
    const { username, password } = req.body;
    const user = findUser(username);
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

function logout (req, res) {
    // Remove the refresh token from the database later 
    tempTokens = tempTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
};

function generateAccessToken(user) {
    return jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
}

function findUser(username) {
    return mockUserData.find(user => user.name === username);
}

module.exports = { register, login, token, logout };