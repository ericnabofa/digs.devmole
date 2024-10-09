// models/userModel.js
const pool = require('../config/db');

const createUser = async (username, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3) RETURNING id, username, email, created_at`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, email, created_at FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
