import pool from '../database/index.js';
import bcrypt from 'bcrypt';

export const createUsersTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        user_role VARCHAR(50) DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  };
  


  export const createUser = async (user) => {
    const { first_name, last_name, email, password, user_role = 'viewer' } = user;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const query = `
      INSERT INTO users (first_name, last_name, email, password, user_role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [first_name, last_name, email, hashedPassword, user_role];
    const result = await pool.query(query, values);
    return result.rows[0];
  };

export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const updateUser = async (id, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((field, index) => `${field} = $${index + 2}`)
    .join(', ');

  const query = `
    UPDATE users
    SET ${fields}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const values = [id, ...Object.values(updatedFields)];

  const result = await pool.query(query, values);
  return result.rows[0];
};
