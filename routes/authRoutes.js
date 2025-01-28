const express = require('express');
const router = express.Router();
const {register, login, token, logout} = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const mockUserData = require('../models/mockUserData');

// /auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/token', token);
router.delete('/logout', logout);
router.get('/users', authenticateToken, (req, res) => {
    res.json(mockUserData.filter(user => user.name === req.user.name))
});

module.exports = router;