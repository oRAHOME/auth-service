const express = require('express');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();
const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('Auth service started on port ${PORT}')
})