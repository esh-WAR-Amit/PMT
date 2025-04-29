const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

// Task routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.get('/tasks/users/:id/in-progress-tasks', taskController.getInProgressTasksForUser);
router.put('/tasks/change-status/:taskId', taskController.changeTaskStatus);
router.get('/tasks/project/:projectId', taskController.getTasksByProjectId);
router.get('/tasks/all/:userId', taskController.getTasksByUserId);
router.put('/tasks/change-name/:taskId', taskController.changeTaskName);
router.put('/tasks/change-description/:taskId', taskController.changeTaskDescription);
router.put('/tasks/change-deadline/:taskId', taskController.changeTaskDeadline);






module.exports = router;
