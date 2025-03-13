const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const { Pool } = require('pg');
const mockUserData = require('./models/mockUserData');

const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const app = express();

const swaggerDocument = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'));

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_SWUg7ubs6hJK@ep-autumn-queen-aa5zy06q-pooler.westus3.azure.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false
      } 
});
// Insert data after the server starts
// const insertMockData = async () => {
//   try {
//     // Call the function to get the hashed mock user data
//     const users = await mockUserData();

//     for (const user of users) {
//       const userRes = await pool.query(
//         'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
//         [user.name, user.email, user.hashedPassword]
//       );
//       const userId = userRes.rows[0].id;

//       for (const device of user.devices) {
//         await pool.query(
//           'INSERT INTO devices (user_id, name, type, state) VALUES ($1, $2, $3, $4)',
//           [userId, device.name, device.type, device.state]
//         );
//       }
//     }
//     console.log("Mock data inserted successfully!");
//   } catch (error) {
//     console.error("Error inserting mock data:", error);
//   }
// };

// Insert data after the server starts
//insertMockData();


  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
    } else {
      console.log('PostgreSQL connection established. Current time:', res.rows[0].now);
    }
  });

  // Swagger UI
// app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
})