const express = require('express');
const router = express.Router();
const { googleAuthCallback, register, login, token, logout} = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const passport = require('passport');

// /auth routes
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

/* istanbul ignore next */
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        if (!req.user) {
            return res.status(401).send("<script>window.opener.postMessage({ error: 'OAuth login failed' }, '*'); window.close();</script>");
        }

        // Send JWT token to the parent window and close the popup
        res.send(`
            <script>
                window.opener.postMessage({ accessToken: "${req.user.token}" }, "*");
                window.close();
            </script>
        `);
    }
);

// For testing purposes only
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Authorized', user: req.user });
});

router.post('/register', register);
router.post('/login', login);
router.post('/token', token);
router.get('/users', authenticateToken, (req, res) => {
    res.json({ user: req.user})
});

module.exports = router;