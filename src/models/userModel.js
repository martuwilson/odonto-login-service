import pool from '../database/index.js';

export const createUser = async (user) => {
  const { first_name, last_name, email, password, user_role = 'viewer' } = user;
  const query = `
    INSERT INTO users (first_name, last_name, email, password, user_role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [first_name, last_name, email, password, user_role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};
