const pool = require('../database');

async function getProjectAdminsQuery(projectId) {
    const query = ` 
      SELECT users.id, users.name
    FROM project_members
    JOIN users ON project_members.userid = users.id
    WHERE project_members.projectid = $1
      AND project_members.role = 'admin';
  `;
  
  
  try {
    const result = await pool.query(query, [projectId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching project admins:', error);
    throw error;
  }
}

module.exports = {
  getProjectAdminsQuery
};
