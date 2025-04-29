const pool = require('../database');

async function getProjectSummaryForUser(userId) {
    const query = `
    SELECT 
        p.id AS projectid,
        p.name AS projectname,
        p.deadline,
        COUNT(t.id) AS total_tasks,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_tasks,
        COUNT(CASE WHEN t.status = 'overdue' THEN 1 END) AS pending_tasks,
        COUNT(CASE WHEN t.status = 'in progress' THEN 1 END) AS in_progress_tasks,
        COUNT(CASE WHEN t.assignedto = $1 THEN 1 END) AS user_tasks,
        COUNT(CASE WHEN t.status = 'in progress' AND t.assignedto = $1 THEN 1 END) AS user_in_progress_tasks
    FROM 
        projects p
    JOIN 
        tasks t ON p.id = t.projectid
    JOIN 
        project_members pm ON pm.projectid = p.id
    WHERE 
        pm.userid = $1
    GROUP BY 
        p.id;
  `;
  
  
  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching project summary:', error);
    throw error;
  }
}

module.exports = {
  getProjectSummaryForUser,
};
