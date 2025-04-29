// models/project.js
const pool = require('../database');

const Project = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      description TEXT,
      createdBy UUID REFERENCES users(id) ON DELETE SET NULL,
      organizationId UUID REFERENCES organizations(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'active',
      deadline DATE,
      createdAt TIMESTAMP DEFAULT NOW(),
      updatedAt TIMESTAMP DEFAULT NOW()
    );
    `;
    await pool.query(query);
  },

  createProject: async (name, description, createdBy, deadline, status) => {
    const client = await pool.connect(); // Connect to the pool
    try {
      await client.query('BEGIN'); // Start a transaction
  
      // Insert the project into the projects table
      const query = `
        INSERT INTO projects (name, description, createdBy, status, deadline)
        VALUES ($1, $2, $3, COALESCE($4, 'active'), $5)
        RETURNING id, name, description, createdBy, status, deadline;  -- Return more details
      `;
      const values = [name, description, createdBy, status, deadline];
      const result = await client.query(query, values);
      const projectId = result.rows[0].id; // Get the created project's ID
  
      // Insert the creator (createdBy) into the project_members table
      const insertMemberQuery = `
        INSERT INTO project_members (projectid, userid, role)
        VALUES ($1, $2, 'admin')  -- Assigning the creator as 'admin'
      `;
      const insertMemberValues = [projectId, createdBy];
      await client.query(insertMemberQuery, insertMemberValues);
  
      await client.query('COMMIT'); // Commit the transaction
      return result.rows[0]; // Return the full project details
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback the transaction in case of error
      console.error('Error creating project:', error);
      throw error; // Throw the error to be handled by the calling function
    } finally {
      client.release(); // Release the client back to the pool
    }
  },
  

  findById: async (id) => {
    const query = `SELECT * FROM projects WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getAllProjects: async()=>{
    const query = `SELECT * FROM projects;`;
    const result = await pool.query(query);
    return result.rows;
  },

  getProjectById: async(id) =>{
    const query = `SELECT * FROM projects WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  updateProject: async (id, name, description, status, deadline) => {
    const query = `
      UPDATE projects
      SET name = $1, description = $2, status = $3, deadline = $4, updatedAt = NOW()
      WHERE id = $5
      RETURNING *;
    `;
    const values = [name, description, status, deadline, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete a project by ID
  deleteProject: async (id) => {
    const query = `DELETE FROM projects WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  getProjectsByUserId: async (userId) => {
    const query = `
      SELECT p.name AS projectName, p.id AS projectId, p.updatedAt
      FROM projects p
      INNER JOIN project_members pm ON p.id = pm.projectId
      WHERE pm.userId = $1
    `;
  
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching projects for user:', error);
      throw new Error('Unable to fetch projects');
    }
  },
  changeProjectStatus: async (projectId, status) => {
    const query = `
      UPDATE projects
      SET status = $1, updatedAt = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, projectId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  changeProjectDescription: async (projectId, description) => {
    const query = `
      UPDATE projects
      SET description = $1, updatedAt = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const values = [description, projectId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  changeProjectName: async (projectId, name) => {
    const query = `
      UPDATE projects
      SET name = $1, updatedAt = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const values = [name, projectId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  changeProjectDeadline: async (projectId, deadline) => {
    const query = `
      UPDATE projects
      SET deadline = $1, updatedAt = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const values = [deadline, projectId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  
  

  // Add other necessary methods for the Project model
};

module.exports = Project;
