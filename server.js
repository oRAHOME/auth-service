require('dotenv').config();
const pool = require('./db');
const app = require('./app');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
    } else {
      console.log('PostgreSQL connection established. Current time:', res.rows[0].now);
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
})