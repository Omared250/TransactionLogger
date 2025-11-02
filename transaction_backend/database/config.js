const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST, // This will be our K8s service name
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Function to initialize the database table
const initializeDb = async () => {
  try {
    const client = await pool.connect();

    // Create the sequence if it doesn't exist
    await client.query(`CREATE SEQUENCE IF NOT EXISTS transactions_id_seq;`);

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

// Function to execute a SQL query
// const executeQuery = async (query, params) => {
//     try {
//         const client = await pool.connect();
//         let result;
//         if (params) {
//             result = await client.query(query, params); // Pass the parameters here if they exist
//         } else {
//             result = await client.query(query); // Execute query without parameters
//         }
//         client.release();
//         return result;
//     } catch (err) {
//         console.error('Error executing query', err.stack);
//         throw err;
//     }
// };

module.exports = { initializeDb }