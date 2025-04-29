
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  getProjectAdmins, 
  getProjectById, 
  getTasksByProjectId, 
  getUserbyId, 
  getProjectMembers 
} from "../apiService";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({
    project: null,
    creator: null,
    admins: [],
    tasks: [],
    members: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        if (!projectId) {
          throw new Error("Project ID is missing.");
        }

        // Fetch project and related data
        const fetchedProject = await getProjectById(projectId);
        const fetchedCreator = fetchedProject?.createdby
          ? await getUserbyId(fetchedProject.createdby)
          : null;
        const fetchedTasks = await getTasksByProjectId(projectId);
        const fetchedAdmins = await getProjectAdmins(projectId);
        const fetchedMembers = await getProjectMembers(projectId);

        setProjectData({
          project: fetchedProject,
          creator: fetchedCreator,
          tasks: fetchedTasks,
          admins: fetchedAdmins,
          members: fetchedMembers,
        });
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(err.message || "Error fetching project data.");
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    fetchProjectData();
  }, [projectId]);

  const contextValue = { ...projectData, loading, error, projectId, setProjectData };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = React.useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
