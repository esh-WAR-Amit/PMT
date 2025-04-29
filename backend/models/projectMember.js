// models/projectMember.js
const pool = require('../database');

const ProjectMember = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS project_members (
        userId UUID REFERENCES users(id) ON DELETE CASCADE,
        projectId UUID REFERENCES projects(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joinedAt DATE DEFAULT NOW(),
        PRIMARY KEY (userId, projectId)
      );
    `;
    await pool.query(query);
  },

  findMembersByProjectId: async (projectId) => {
    const query = `
      SELECT * FROM project_members WHERE projectId = $1;
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows;
  },

  addMember: async (userId, projectId, role = 'member') => {
    const query = `
      INSERT INTO project_members (userId, projectId, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (userId, projectId) DO NOTHING
      RETURNING *;
    `;
    const values = [userId, projectId, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  addMembers: async (userIds, projectId, role = 'member') => {
    // Generate the VALUES clause dynamically for each userId
    const valuesClause = userIds.map((_, index) => `($${index + 1}, $${userIds.length + 1}, $${userIds.length + 2})`).join(", ");
    
    const query = `
      INSERT INTO project_members (userId, projectId, role)
      VALUES ${valuesClause}
      ON CONFLICT (userId, projectId) DO NOTHING
      RETURNING *;
    `;
    
    const values = [...userIds, projectId, role];
    const result = await pool.query(query, values);
    return result.rows;
  },

  removeMember: async (userId, projectId) => {
    const query = `
      DELETE FROM project_members 
      WHERE userId = $1 AND projectId = $2
      RETURNING *;
    `;
    const values = [userId, projectId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  editMember: async (userId, projectId, newRole) => {
    const query = `
      UPDATE project_members 
      SET role = $3
      WHERE userId = $1 AND projectId = $2
      RETURNING *;
    `;
    const values = [userId, projectId, newRole];
    const result = await pool.query(query, values);
    return result.rows[0];
  },


  // Add other necessary methods for the ProjectMember model
};

module.exports = ProjectMember;
