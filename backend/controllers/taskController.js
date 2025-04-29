const Task = require('../models/task');
const { getTasksByProjectId } = require('../queries/getTasksByProjectId');
const { getTasksByUserId } = require('../queries/getTasksByUserId');
const getTaskInfo = require('../queries/getTaskUsers');
const UserPendingTasksQueries = require('../queries/userInProgressTasksQueries');

const taskController = {
  createTask: async (req, res) => {
    try {
      const { name, description, assignedTo, projectId, status, deadline } = req.body;

      if (!name || !assignedTo || !projectId) {
        return res.status(400).json({ message: 'Name, assignedTo, and projectId are required' });
      }

      const newTask = await Task.createTask(name, description, assignedTo, projectId, status, deadline);
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating task' });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving task' });
    }
  },

  getTasksByUserId: async (req, res)=> {
    try {
      const { userId} = req.params;
      const tasks = await getTasksByUserId(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Error fetchin tasks for this user'})
    }
  },

  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, assignedTo, projectId, status, deadline } = req.body;

      const updatedTask = await Task.updateTask(id, name, description, assignedTo, projectId, status, deadline);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },

  changeTaskStatus: async (req, res) => {
    try {
      const { taskId } = req.params; // Get the task ID from the request parameters
      const {status} = req.body;
  
      // Check if the status is provided
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
  
      // Update the task status using the Task model's changeTaskStatus method
      const changedTaskStatus = await Task.changeTaskStatus(taskId, status);
      
      // Check if the task was found and updated
      if (!changedTaskStatus) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Respond with the updated task status
      res.status(200).json(changedTaskStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },

  
  changeTaskName: async (req, res) => {
    try {
      const { taskId } = req.params; // Get the task ID from the request parameters
      const {name} = req.body;  
      // Check if the status is provided
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }
  
      // Update the task status using the Task model's changeTaskStatus method
      const changedTaskName = await Task.changeTaskName(taskId, name);
      
      // Check if the task was found and updated
      if (!changedTaskName) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Respond with the updated task status
      res.status(200).json(changedTaskName);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },

  changeTaskDescription: async (req, res) => {
    try {
      const { taskId } = req.params; 
      const {description} = req.body;  
      // Check if the status is provided
      if (!description) {
        return res.status(400).json({ message: 'Description is required' });
      }
  
      // Update the task status using the Task model's changeTaskStatus method
      const changedTaskDescription = await Task.changeTaskDescription(taskId, description);
      
      // Check if the task was found and updated
      if (!changedTaskDescription) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Respond with the updated task status
      res.status(200).json(changedTaskDescription);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },

  changeTaskDeadline: async (req, res) => {
    try {
      const { taskId } = req.params; 
      const {deadline} = req.body;  
      // Check if the status is provided
      if (!deadline) {
        return res.status(400).json({ message: 'Deadline is required' });
      }
  
      // Update the task status using the Task model's changeTaskStatus method
      const changedTaskDeadline = await Task.changeTaskDeadline(taskId, deadline);
      
      // Check if the task was found and updated
      if (!changedTaskDeadline) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Respond with the updated task status
      res.status(200).json(changedTaskDeadline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating task' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      await Task.deleteTask(id);
      res.status(204).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting task' });
    }
  },
  
  getInProgressTasksForUser: async (req, res) => {
    const userId = req.params.id; // Assuming you're passing the user ID in the route
    try {
      const tasks = await UserPendingTasksQueries.getInProgressTasksByUserId(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching in progress tasks' });
    }
  },

  getTasksByProjectId: async (req, res) =>{
    const projectId= req.params.projectId
    try {
      const tasks = await getTasksByProjectId(projectId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  },

  getTaskUsers: async(req, res) =>{
    const projectId= req.params.projectId
    const taskId= req.params.taskId
    try {
      const result = await getTaskInfo.getTaskUsers(taskId, projectId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks and users' });
    }
  }
};

module.exports = taskController;
