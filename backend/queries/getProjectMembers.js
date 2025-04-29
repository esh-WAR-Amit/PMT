const pool = require('../database');

async function getProjectMembers(projectId) {
    const query = `
    SELECT 
      users.id AS user_id,
      users.name AS user_name,
      users.profilepicurl AS user_profile_pic_url,
      users.email AS user_email,
      project_members.role AS user_role,
      project_members.joinedat AS joined_at
    FROM 
      users
    INNER JOIN 
      project_members ON users.id = project_members.userid
    WHERE 
      project_members.projectid = $1;
  `;
  
  
  try {
    const result = await pool.query(query, [projectId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching project members:', error);
    throw error;
  }
}

module.exports = {
  getProjectMembers,
};
