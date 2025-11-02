const { Pool } = require('pg');
// PostgreSQL connection pool
// Details are read from environment variables for security and flexibility.
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST, // This will be our K8s service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Function to initialize the database table
const initializeDb = async () => {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log('Database table "transactions" is ready.');
  } catch (err) {
    console.error('Error initializing database:', err);
    // Retry connection, as the DB might not be ready yet
    setTimeout(initializeDb, 5000);
  }
};

module.exports = { initializeDb }