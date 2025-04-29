const pool = require('../database');

async function getTasksByUserId(userId) {
    const query = ` 
       SELECT 
        tasks.id AS "taskId",
        tasks.status,
        tasks.deadline,
        tasks.createdat AS "createdAt",
        tasks.name AS "taskName",
        tasks.description,
        tasks.projectid AS "projectId",
        projects.name AS "projectName"
    FROM 
        tasks
    JOIN 
        projects
    ON 
        tasks.projectid = projects.id
    WHERE 
        tasks.assignedto = $1;
  `;
  
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching tasks for the user:', error);
    throw error;
  }
}

module.exports = {
  getTasksByUserId
};
