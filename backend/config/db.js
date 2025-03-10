const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected successfully');
  connection.release();
});

// Convert pool to use promises
const promisePool = pool.promise();

// Execute queries
async function query(sql, params) {
  try {
    const [rows, fields] = await promisePool.execute(sql, params);
    return [rows, fields];
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Transaction support
async function beginTransaction() {
  const connection = await promisePool.getConnection();
  await connection.beginTransaction();
  return connection;
}

async function commit(connection) {
  await connection.commit();
  connection.release();
}

async function rollback(connection) {
  await connection.rollback();
  connection.release();
}

module.exports = promisePool;