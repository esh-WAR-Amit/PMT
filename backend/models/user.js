// models/user.js
const pool = require('../database');
const bcrypt = require('bcrypt');

const User = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      profilePicUrl TEXT,
      email VARCHAR(255) UNIQUE NOT NULL,
      gender VARCHAR(10),
      organizationId UUID REFERENCES organizations(id) ON DELETE SET NULL,
      createdAt TIMESTAMP DEFAULT NOW(),
      updatedAt TIMESTAMP DEFAULT NOW()
    );
    `;
    await pool.query(query);
  },

  // Create a new user
  createUser: async (name, password, email, gender) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the profile picture URL based on gender
    const profilePicUrl = gender.toLowerCase() === 'female'
        ? `https://avatar.iran.liara.run/public/girl?username=${encodeURIComponent(name)}`
        : `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(name)}`;

    const query = `
      INSERT INTO users (name, password, email, gender, profilePicUrl)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, profilePicUrl, gender, createdAt;
    `;
    const values = [name, hashedPassword, email, gender, profilePicUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
},


  // Get all users
  getAllUsers: async () => {
    const query = `SELECT id, name, email, profilePicUrl, gender, createdAt FROM users;`;
    const result = await pool.query(query);
    return result.rows;
},

// Get a user by ID
getUserById: async (id) => {
  const query = `SELECT id, name, email, profilePicUrl, gender, createdAt FROM users WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
},

// Update a user by ID
updateUser: async (id, updates) => {
    const { name, password, email, profilePicUrl, gender } = updates;

    // Optional: Hash the password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const query = `
      UPDATE users
      SET name = COALESCE($1, name),
          password = COALESCE($2, password),
          email = COALESCE($3, email),
          profilePicUrl = COALESCE($4, profilePicUrl),
          gender = COALESCE($5, gender),
          updatedAt = NOW()
      WHERE id = $6
      RETURNING id, name, email, profilePicUrl, gender, updatedAt;
    `;
    const values = [name, hashedPassword, email, profilePicUrl, gender, id];
    const result = await pool.query(query, values);
    return result.rows[0];
},

// Delete a user by ID
deleteUser: async (id) => {
    const query = `DELETE FROM users WHERE id = $1 RETURNING id, name, gender;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
},

// Get a user by email
getUserByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
},

};

module.exports = User;
