const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
app.use(express.json());

// temporay storage for refresh tokens until we have a database
let tempTokens = [];

const mockUserData = [{
    name: 'Mark',
    devices: [
        {name: 'switch', type: 'light', state: 'off'},
        {name: 'heater', type: 'heater', state: 'off'}
    ]},
    {
    name: 'Jill',
    devices: [
        {name: 'switch', type: 'light', state: 'off'},
        {name: 'wifi', type: 'router', state: 'off'}
    ]}
]

app.get('/users', authenticateToken, (req, res) => {
    res.json(mockUserData.filter(user => user.name === req.user.name))
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!tempTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken})
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    // change to database later
    tempTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

app.delete('/logout', (req, res) => {
    tempTokens = tempTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHearder.split(' ')[1] 
    if (token == null) return res.SendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.SendStatus(403)
        req.user = user
        next()
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
}

app.listen(8000, () => {
    console.log('Auth service started on port 8000')
})