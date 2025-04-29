const ProjectMember = require('../models/projectMember');

const projectMemberController = {
  // Add a new member to a project
  addMember: async (req, res) => {
    try {
      const { userId, projectId, role } = req.body;

      // Validate request data
      if (!userId || !projectId) {
        return res.status(400).json({ message: 'User ID and Project ID are required' });
      }

      const newMember = await ProjectMember.addMember(userId, projectId, role || 'member');
      if (newMember) {
        res.status(201).json(newMember);
      } else {
        res.status(409).json({ message: 'Member already exists in the project' });
      }
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ message: 'Error adding member' });
    }
  },

  addMembersToProject: async (req, res) => {
    try {
      const { projectId } = req.params; // Project ID from URL params
      const { userIds, role = 'member' } = req.body; // userIds array and optional role from request body
  
      // Validate input
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ message: "userIds must be a non-empty array" });
      }
  
      if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
      }
  
      // Call service function to add members
      const addedMembers = await ProjectMember.addMembers(userIds, projectId, role);
  
      // Check if members were added successfully
      if (addedMembers.length === 0) {
        return res.status(409).json({ message: "No members were added (they may already exist in the project)" });
      }
  
      // Respond with the added members
      res.status(201).json({ message: "Members added successfully", data: addedMembers });
    } catch (error) {
      console.error("Error adding members to project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Remove a member from a project
  removeMember: async (req, res) => {
    try {
      const { userId, projectId } = req.params;

      const removedMember = await ProjectMember.removeMember(userId, projectId);
      if (removedMember) {
        res.status(200).json({ message: 'Member removed successfully' });
      } else {
        res.status(404).json({ message: 'Member not found in the project' });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({ message: 'Error removing member' });
    }
  },

  // Edit a member's role in a project
  editMember: async (req, res) => {
    try {
      const { userId, projectId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }

      const updatedMember = await ProjectMember.editMember(userId, projectId, role);
      if (updatedMember) {
        res.status(200).json(updatedMember);
      } else {
        res.status(404).json({ message: 'Member not found in the project' });
      }
    } catch (error) {
      console.error('Error updating member role:', error);
      res.status(500).json({ message: 'Error updating member role' });
    }
  },

  // List all members of a project
  listMembers: async (req, res) => {
    try {
      const { projectId } = req.params;

      const members = await ProjectMember.findMembersByProjectId(projectId);
      res.status(200).json(members);
    } catch (error) {
      console.error('Error fetching project members:', error);
      res.status(500).json({ message: 'Error fetching project members' });
    }
  }
};

module.exports = projectMemberController;
