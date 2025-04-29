import { Flex, Group, Paper, SimpleGrid, Title } from '@mantine/core';
import ProjectProgress from './ProjectProgress';
import YourTotalTasks from './YourTotalTasks';


const ProjectsStats = () => {
 

  return (
    
    <Paper shadow="xl" radius="md" withBorder p="xl" my={20} bg={'gray.0'}>
      <ProjectProgress/>
    </Paper>
  );
};

export default ProjectsStats;
