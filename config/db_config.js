const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PG_USER,        
  password: process.env.PG_PASSWORD,  
  host: process.env.PG_HOST,        
  port: process.env.PG_PORT,        
  database: process.env.PG_DATABASE, 
  schema: process.env.PG_SCHEMA,
});

// Function to connect to the PostgreSQL database
const dbConnection = async () => {
  try {
    await pool.connect();
    console.log('DB running on port ', process.env.PG_PORT);
  } catch (e) {
    console.error(e);
    throw new Error('Error connecting to DB.');
  }
};

module.exports = {
  dbConnection,
  pool
};
