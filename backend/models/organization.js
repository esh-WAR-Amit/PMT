const pool = require('../database');

const Organization = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(query);
  }
};

module.exports = Organization; 