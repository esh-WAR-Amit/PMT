import { Box, Flex, Progress, Text, Title, Tooltip } from '@mantine/core';
import React, { useContext } from 'react';
import { ProjectContext } from '../contexts/ProjectContext';

const ProjectPageProgressBar = () => {
  const { tasks } = useContext(ProjectContext);

  if (!tasks || tasks.length === 0) {
    return null; // Return null for cleaner rendering if no tasks
  }

  const getTaskStats = (tasks) => {
    const totalTasks = tasks.length;

    const statusCounts = {
      completed: 0,
      inProgress: 0,
      overdue: 0,
    };

    tasks.forEach((task) => {
      if (task.task_status === 'completed') {
        statusCounts.completed += 1;
      } else if (task.task_status === 'in progress') {
        statusCounts.inProgress += 1;
      } else if (task.task_status === 'overdue') {
        statusCounts.overdue += 1;
      }
    });

    // Calculate percentages
    const statusPercentages = {
      completed: ((statusCounts.completed / totalTasks) * 100).toFixed(0),
      inProgress: ((statusCounts.inProgress / totalTasks) * 100).toFixed(0),
      overdue: ((statusCounts.overdue / totalTasks) * 100).toFixed(0),
    };

    return {
      totalTasks,
      statusCounts,
      statusPercentages,
    };
  };

  const taskStats = getTaskStats(tasks);

  const statusLabels = {
    completed: 'Completed',
    inProgress: 'In Progress',
    overdue: 'Overdue',
  };

  return (
    <Box shadow="xl" radius="md" bg="gray.0" p={15} flex={1}>
      <Title ff="poppins" c="dark.4" fz={25} fw={600} lts={-1} lh={2}>
        Status
      </Title>
      <Flex gap={15} align="center" direction={{ base: 'column', sm: 'row' }}>
        <Flex direction="column" gap={5} flex={1} style={{ width: '100%' }}>
          {['completed', 'inProgress', 'overdue'].map((status) => (
            <Progress.Root key={status} size={27}>
              <Tooltip
                label={`${statusLabels[status]}: ${taskStats.statusCounts[status]}`}
              >
                <Progress.Section
                  value={taskStats.statusPercentages[status]}
                  color={
                    status === 'completed'
                      ? 'green.9'
                      : status === 'inProgress'
                      ? 'blue.8'
                      : '#940000'
                  }
                >
                  <Progress.Label ff="poppins" fw={500} fz={13}>
                    {statusLabels[status]}
                  </Progress.Label>
                </Progress.Section>
              </Tooltip>
            </Progress.Root>
          ))}
        </Flex>
        <Text ff="poppins" c="dark.4" fw={600} fz={15}>
          <Text
            span
            gradient={{ from: 'orange.5', to: 'orange.9', deg: 90 }}
            fz={30}
            variant="gradient"
            fw={700}
            lts={-1}
          >
            {taskStats.statusPercentages.completed}%
          </Text>{' '}
          Completed
        </Text>
      </Flex>
    </Box>
  );
};

export default ProjectPageProgressBar;
