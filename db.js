const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_SWUg7ubs6hJK@ep-autumn-queen-aa5zy06q-pooler.westus3.azure.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false
      } 
});

module.exports = pool;