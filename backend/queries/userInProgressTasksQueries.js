const pool = require('../database');

const UserInProgressTasksQueries = {
  // Store userId in a variable in frontend!
  getInProgressTasksByUserId: async (userId) => {
    const query = `
      SELECT t.id, t.name, t.description, t.status, t.deadline, p.name AS projectName
      FROM tasks t
      JOIN projects p ON t.projectId = p.id
      WHERE t.assignedTo = $1 AND t.status = 'in progress';
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  },
};

module.exports = UserInProgressTasksQueries;