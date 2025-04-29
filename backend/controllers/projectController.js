const Project = require("../models/project");
const ProjectMember = require('../models/projectMember');
const { getProjectAdminsQuery } = require("../queries/getProjectAdmins");
const { getProjectMembers } = require("../queries/getProjectMembers");
const { getProjectSummaryForUser } = require("../queries/getProjectSummaryForUser");

const projectController = {

  createProject: async (req, res) => {
    try {
      const { name, description, createdBy, deadline, status } = req.body;
      if (!name || !description || !createdBy) {
        return res
          .status(400)
          .json({ message: "Name, description, and createdBy are required" });
      }
      const newProject = await Project.createProject(
        name,
        description,
        createdBy,
        deadline,
        status
      );
      await ProjectMember.addMember(createdBy, newProject.id, 'admin');
      res.status(201).json(newProject);
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: 'Error creating project' });
    }
  },

  addMemberToProject: async (req, res) => {
    try {
      const { userId, projectId, role } = req.body;
  
      // Check if the user and project exist
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Add the member to the project
      const newMember = await ProjectMember.addMember(userId, projectId, role);
  
      res.status(201).json(newMember);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding member to project' });
    }
  },

  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving projects' });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.getProjectById(id);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving project' });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, status, deadline } = req.body;

      const updatedProject = await Project.updateProject(id, name, description, status, deadline);

      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating project' });
    }
  },

  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProject = await Project.deleteProject(id);

      if (!deletedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting project' });
    }
  },

  fetchProjectSummary: async(req, res) => {
    const { userId } = req.params;

  try {
    const projectSummary = await getProjectSummaryForUser(userId);
    console.log(projectSummary)
    res.json(projectSummary);
  } catch (error) {
    console.error('Error fetching project summary:', error);
    res.status(500).json({ error: 'Failed to fetch project summary.' });
  }
  },

  getProjectsByUseId: async(req, res)=> {
    const {userId} = req.params;

    try {
      const proectsByUserId = await Project.getProjectsByUserId(userId);
      res.json(proectsByUserId)
    } catch (error) {
      console.error('Error fetching projects by User Id:', error);
    res.status(500).json({ error: 'Failed to fetch projects by user id.' });
    }
  },

  getProjectMembers: async(req, res)=> {
    const{projectId} = req.params;

    try {
      const projectMembers= await getProjectMembers(projectId)
      res.status(200).json(projectMembers)
    } catch (error) {
      console.error('Error fetching project Members:', error);
    res.status(500).json({ error: 'Failed to fetch project members' });
    }
  },

  getProjectAdmins: async(req, res)=>{
    const {projectId} = req.params;

    try {
      const admins = await getProjectAdminsQuery(projectId)
      res.status(200).json(admins)
    } catch (error) {
      console.error('Error fetching project admins:', error);
    res.status(500).json({ error: 'Failed to fetch project admins' });
    }
  },
  changeProjectStatus: async (req, res) => {
    try {
      const { projectId } = req.params;
      const {status} = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
  
      const changedProjectStatus = await Project.changeProjectStatus(projectId, status);
      
      // Check if the task was found and updated
      if (!changedProjectStatus) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(changedProjectStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },
  changeProjectDescription: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { description } = req.body;
  
      if (!description) {
        return res.status(400).json({ message: ' description is required' });
      }
  
      const updatedProject = await Project.changeProjectDescription(projectId, description);
  
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating project information' });
    }
  },

  changeProjectName: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: ' name is required' });
      }
  
      const updatedProject = await Project.changeProjectName(projectId, name);
  
      if (!updatedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating project information' });
    }
  },

  changeProjectDeadline: async (req, res) => {
    try {
      const { projectId } = req.params;
      const {deadline} = req.body;
      console.log("🚀 ~ changeProjectDeadline: ~ deadline:", deadline)
      
      if (!deadline) {
        return res.status(400).json({ message: 'Deadline is required' });
      }
  
      const changedProjectDeadline = await Project.changeProjectDeadline(projectId, deadline);
      
      if (!changedProjectDeadline) {
        return res.status(404).json({ message: 'Project not found' });
      }
      console.log(changedProjectDeadline)
  
      res.status(200).json(changedProjectDeadline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },
  
};


module.exports = projectController;
