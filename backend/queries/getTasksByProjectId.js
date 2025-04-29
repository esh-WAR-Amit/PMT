const pool = require('../database');

async function getTasksByProjectId(projectId) {
    const query = `
    SELECT 
      tasks.id AS task_id,
      tasks.name AS task_name,
      tasks.description AS task_description,
      tasks.status AS task_status,
      tasks.assignedto AS assigned_to_user_id,
      tasks.deadline AS task_deadline,
      tasks.createdat AS task_created_at,
      users.name AS assigned_user_name,
      users.email AS assigned_user_email,
      users.profilepicurl AS assigned_user_profile_pic
    FROM 
      tasks
    JOIN 
      users 
    ON 
      tasks.assignedto = users.id
    WHERE 
      tasks.projectid = $1;
  `;
  
  
  try {
    const result = await pool.query(query, [projectId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching tasks :', error);
    throw error;
  }
}

module.exports = {
    getTasksByProjectId,
};
