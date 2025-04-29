// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');

// Route to create a new project
router.post('/projects/', projectController.createProject);

// Route to get all projects
router.get('/projects/', projectController.getAllProjects);

// Route to get a specific project by ID
router.get('/projects/:id', projectController.getProjectById);

// Route to update a specific project by ID
router.put('/projects/:id', projectController.updateProject);

// Route to delete a specific project by ID
router.delete('/projects/:id', projectController.deleteProject);

router.post('/projects/:projectId/members', projectController.addMemberToProject);

router.get('/projects/summary/:userId', projectController.fetchProjectSummary);

router.get('/projects/all/:userId', projectController.getProjectsByUseId );

router.get('/projects/project-members/:projectId', projectController.getProjectMembers);

router.get('/projects/:projectId/task/:taskId', taskController.getTaskUsers);

router.get('/projects/admins/:projectId', projectController.getProjectAdmins);

router.put('/projects/:projectId/status', projectController.changeProjectStatus);

router.put('/projects/change-description/:projectId', projectController.changeProjectDescription);

router.put('/projects/change-deadline/:projectId', projectController.changeProjectDeadline);

router.put('/projects/change-name/:projectId', projectController.changeProjectName);





module.exports = router;
