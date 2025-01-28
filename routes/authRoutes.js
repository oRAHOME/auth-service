const express = require('express');
const router = express.Router();
const { googleAuthCallback, register, login, token, logout} = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const passport = require('passport');

// /auth routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', passport.authenticate('google', { session: false } ), googleAuthCallback);
router.post('/register', register);
router.post('/login', login);
router.post('/token', token);
router.delete('/logout', logout);
router.get('/users', authenticateToken, (req, res) => {
    res.json({ user: req.user})
});

module.exports = router;