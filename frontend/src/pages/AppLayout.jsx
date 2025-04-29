import React, { useEffect, useState } from 'react';
import { AppShell, Burger, Group, LoadingOverlay, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Dashboard from './Dashboard';
import UserProjects from './UserProjects';
import ProjectPage from './ProjectPage';
import CreateNewProject from './CreateNewProject';
import TaskPage from './TaskPage';
import AddNewTaskPage from './AddNewTaskPage';
import { ProjectProvider } from '../contexts/ProjectContext';
import { TaskProvider } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../axiosInstance';
import { getUserbyId } from '../apiService';
import UserTasksPage from './UserTasksPage';


const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data based on userId stored in localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Fetch the user data from backend (replace with your actual fetch logic)
      fetchUserData(userId);
    } else {
      // If no userId in localStorage, redirect to login page
      navigate('/login');
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await getUserbyId(userId);
      setUser(response);
      setLoading(false);  // Once the user data is fetched, stop loading
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);  // Stop loading even if there is an error
    }
  };

  if (loading) {
    return (
      <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'orange', type: 'bars' }} />
    ); 
  }

  return (
    <AppShell
      header={{ height: { base: 80, md: 80, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 200, lg: 250 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header withBorder={true} bg="gray.0" pl={10}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text
            onClick={() => navigate('/')}
            size={35}
            ff="poppins"
            fw={700}
            lh={1}
            lts={-2}
            style={{
              cursor: 'pointer',
              display: 'inline-block',
              padding: '4px',
            }}
          >
            <span style={{ color: '#2e2e2e', fontWeight: 500, letterSpacing: -2.5 }}>
              task
            </span>
            <span style={{ color: '#e8590c', fontWeight: 700, marginLeft: '0px' }}>
              PRO
            </span>
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar withBorder={true} py="md" bg="gray.0">
        <Navbar onLinkClick={toggle} user={user} />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user-projects" element={<UserProjects />} />
          <Route path="user-projects/project/:projectId" element={<ProjectPage />} />
          <Route path="projects/create" element={<CreateNewProject />} />
          <Route path="/tasks/all/:userId" element={<UserTasksPage/>}/>
          <Route path="/user-projects/:projectId/task/:taskId" element={<TaskProvider><TaskPage /></TaskProvider>} />
          <Route path="//user-projects/project/:projectId/new-task" element={<ProjectProvider><AddNewTaskPage /></ProjectProvider>} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
