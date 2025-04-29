const pool = require('../database');

const getTaskInfo = {
  // Store userId in a variable in frontend!
  getTaskUsers: async (taskId, projectId) => {
    const query = `
      SELECT 
  tasks.id AS task_id,
  tasks.name AS task_name,
  tasks.description AS task_description,
  tasks.status AS task_status,
  tasks.deadline AS task_deadline,
  tasks.assignedto AS task_assigned_to,
  projects.name AS project_name,
  users.id AS user_id,
  users.name AS user_name,
  users.email AS user_email,
  users.profilepicurl AS user_profile_pic_url
FROM 
  tasks
JOIN 
  projects ON tasks.projectid = projects.id
JOIN 
  users ON tasks.assignedto = users.id
WHERE 
  tasks.id = $1
  AND projects.id = $2;

    `;
    const values = [taskId, projectId];
    try {
        const result = await pool.query(query, values);
        return result.rows;
      } catch (error) {
        console.error("Error fetching task and project details:", error);
        throw error;
      }
  },
};

module.exports = getTaskInfo;