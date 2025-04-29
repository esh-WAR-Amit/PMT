const express = require('express');
const router = express.Router();
const projectMemberController = require('../controllers/projectMemberController');

// Route to add a new member to a project
router.post('/project-members/add', projectMemberController.addMember);

// Route to remove a member from a project
router.delete('/project-members/:projectId/:userId', projectMemberController.removeMember);

// Route to edit a member's role in a project
router.put('/project-members/:projectId/:userId', projectMemberController.editMember);

// Route to list all members in a project
router.get('/project-members/:projectId', projectMemberController.listMembers);

router.post('/project-members/:projectId/members', projectMemberController.addMembersToProject);

module.exports = router;
