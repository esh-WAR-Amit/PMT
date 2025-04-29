import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectAdmins, getTaskUsers } from "../apiService";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const { projectId, taskId } = useParams();
    const [taskData, setTaskData] = useState({
      task: null,
      admins: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchTaskData = async () => {
        try {
          setLoading(true);
          setError(null);
  
          if (!taskId || !projectId) {
            throw new Error("Task ID or Project ID is missing.");
          }
  
          // Fetch task and admins data
          const fetchedTask = await getTaskUsers(taskId, projectId);
          const fetchedAdmins = await getProjectAdmins(projectId);
  
          setTaskData({
            task: fetchedTask,
            admins: fetchedAdmins,
          });
        } catch (err) {
          console.error("Error fetching task data:", err);
          setError(err.message || "Error fetching task data.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTaskData();
    }, [projectId, taskId]);
  
    const contextValue = { ...taskData, setTaskData, loading, error, projectId };
  
    return (
      <TaskContext.Provider value={contextValue}>
        {children}
      </TaskContext.Provider>
    );
  };
  