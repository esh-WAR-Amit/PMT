// database.js
require('dotenv').config();
const { Pool } = require('pg');

// Configure the connection pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Export the pool for use in other files
module.exports = pool;
