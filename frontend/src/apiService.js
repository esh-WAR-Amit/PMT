
import axiosInstance from './axiosInstance';

export const getInProgressTasks = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/tasks/users/${userId}/in-progress-tasks`);
    // console.log(response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching in progress tasks:', error);
    throw error;
  }
};



export const markTaskCompleted = async (taskId, status) => {
    try {
      const response = await axiosInstance.put(`/api/tasks/change-status/${taskId}`, {status});
      return response.data;
    } catch (error) {
      console.error('Error marking task as completed:', error);
      throw error;
    }
  };

  export const changeTaskName = async (taskId, name) => {
    try {
      const response = await axiosInstance.put(`/api/tasks/change-name/${taskId}`, {name});
      return response.data;
    } catch (error) {
      console.error('Error changing task name:', error);
      throw error;
    }
  };

  export const changeTaskDescription = async (taskId, description) => {
    try {
      const response = await axiosInstance.put(`/api/tasks/change-description/${taskId}`, {description});
      return response.data;
    } catch (error) {
      console.error('Error changing task description:', error);
      throw error;
    }
  };
  export const changeTaskDeadline = async (taskId, deadline) => {
    try {
      const response = await axiosInstance.put(`/api/tasks/change-deadline/${taskId}`, {deadline});
      return response.data;
    } catch (error) {
      console.error('Error changing task deadline:', error);
      throw error;
    }
  };

  export const changeProjectStatus = async (projectId, status) => {
    try {
      const response = await axiosInstance.put(`/api/projects/${projectId}/status`, {status});
      return response.data;
    } catch (error) {
      console.error('Error changing status:', error);
      throw error;
    }
  }

  export const changeProjectDescription = async (projectId, description) => {
    try {
      const response = await axiosInstance.put(`/api/projects/change-description/${projectId}`, { description});
      return response.data;
    } catch (error) {
      console.error('Error changing desc:', error);
      throw error;
    }
  }

  export const changeProjectName = async (projectId, name) => {
    try {
      const response = await axiosInstance.put(`/api/projects/change-name/${projectId}`, { name});
      return response.data;
    } catch (error) {
      console.error('Error changing name:', error);
      throw error;
    }
  }

  export const changeProjectDeadline = async (projectId, deadline) => {
    try {
      
      const response = await axiosInstance.put(`/api/projects/change-deadline/${projectId}`, {deadline} );
      return response.data;
    } catch (error) {
      console.error('Error changing deadline:', error);
      throw error;
    }
  }

  export const getProjectSummary = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/summary/${userId}`);
      return response.data; // Return the data from the response
    } catch (error) {
      console.error('Error fetching project summary:', error);
      throw error; // Rethrow the error for handling in the component
    }
  };


  export const getProjectsByUserId = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/projects/all/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Projects by User id');
      throw error;
    }
  }

  export const createProject = async(projectData) => {
    try {
      const response = await axiosInstance.post(`/api/projects`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
    throw error;
    }
  }

  export const getAllUsers = async()=>{
    try {
      const response = await axiosInstance.get('/api/users');
      return response.data
    } catch (error) {
      console.error('Error fetching Users: ', error);
      throw error;
    }
  }

  export const getUserbyId = async(userId)=>{
    try {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting the user: ', error)
      throw error;
    }
  }


  export const addProjectMembers = async (userIds, projectId) => {
    try {
      // Send userIds array and role to the backend, default role is 'member'
      const response = await axiosInstance.post(`/api/project-members/${projectId}/members`, {
        userIds,
        role: 'member',
      });
  
      return response.data;
    } catch (error) {
      console.error('Error adding project members:', error);
      throw error;
    }
  };

  export const getProjectById = async(projectId)=>{
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting this project: ', error)
      throw error;
    }
  }

  export const getTasksByProjectId = async(projectId)=>{
    try {
      const response = await axiosInstance.get(`/api/tasks/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting tasks: ', error)
      throw error;
    }
  }

  export const getProjectMembers = async(projectId)=>{
    try {
      const response = await axiosInstance.get(`/api/projects/project-members/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting members: ', error)
      throw error;
    }
  }

  export const getTasksByUserId = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/tasks/all/${userId}`);
        return response.data;
    } catch (error) {
      console.error('Error getting tasks', error)
      throw error;
    }
  }
 

  export const getTaskUsers = async(taskId, projectId)=>{
    try {
      const response = await axiosInstance.get(`/api/projects/${projectId}/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting task and members: ', error)
      throw error;
    }
  }


  export const getProjectAdmins = async(projectId) =>{
    try {
      const response = await axiosInstance.get(`/api/projects/admins/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting project admins: ', error)
      throw error;
    }
  }

  export const createTask = async(taskData) =>{
    try {
      
      const response = await axiosInstance.post(`/api/tasks/`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
    throw error;
    }
  }

  export const deleteTask = async (taskId) =>{
    try {
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`)
      return response.data;
    } catch (error) {
      console.error("Error deleting task: ", error)
      throw error
    }
  }

  export const deleteProject = async (projectId) =>{
    try {
      const response = await axiosInstance.delete(`/api/projects/${projectId}`)
      return response.data;
    } catch (error) {
      console.error("Error deleting project: ", error)
      throw error
    }
  }


  export const loginUser = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log(response.data)
      return response.data;
      
    } catch (error) {
      throw error;
    }
  }

  export const logoutUser = async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Example protected route
  export const getProtectedData = async () => {
    try {
      const response = await axiosInstance.get('/protected-route');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

