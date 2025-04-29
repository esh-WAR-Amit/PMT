import React, { useEffect, useState } from "react";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

import { getInProgressTasks, markTaskCompleted } from "../apiService";
import {
  Table,
  Text,
  Loader,
  Button,
  Container,
  Paper,
  ScrollArea,
  Badge,
  Title,
  Skeleton,
  Spoiler,
  Dialog,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const InProgressTasks = () => {
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [opened, { toggle, close }] = useDisclosure(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const { user } = useAuth();
    const userId = user.id;
    const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks = await getInProgressTasks(userId);
        setInProgressTasks(tasks);
      } catch (error) {
        setError("Error fetching in-progress tasks");
        console.error("Error fetching in-progress tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  console.log(inProgressTasks)

  const handleMarkAsCompleted = async () => {
    if (!selectedTaskId) return;

    try {
      await markTaskCompleted(selectedTaskId);
      setInProgressTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== selectedTaskId)
      ); // Update state to remove the completed task
      close(); // Close the dialog after marking as completed
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) {
      return "Expired!";
    }

    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysLeft = Math.floor(hoursLeft / 24);

    return daysLeft > 0 ? `${daysLeft} days` : `${hoursLeft} hours`;
  };

  const formatDeadline = (deadline) => {
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };

    const formattedDate = new Date(deadline).toLocaleString(undefined, options);

    return formattedDate;
  };

  if (loading) {
    return (
      <Paper shadow="xl" radius="md" withBorder p={20} bg={"gray.0"}  >
        <Title size="h1" c={'dark.6'} ff={'poppins'} mb={10} fw={600} lts={-2} lh={2}>
        Tasks in Progress
      </Title>
        <Text>Loading tasks...</Text>
        <Skeleton height={35} mt={20} radius="xl" />
        <Skeleton height={35} mt={20} radius="xl" />
        <Skeleton height={35} mt={20} radius="xl" />
        <Skeleton height={35} mt={20} radius="xl" />
      </Paper>
    );
  }

  if (error) {
    return <Paper shadow="xl" radius="md" withBorder p={20} bg={"gray.0"}  >
     <Title size="h1" c={'dark.6'} ff={'poppins'} mb={10} fw={600} lts={-2} lh={2}>
        Tasks in Progress
      </Title>
    <Text fz={20} c={'red.9'} fw={500}>{error}</Text>
    </Paper>
  }

  return (
    <Paper shadow="xl" radius="md" withBorder p={20} bg={"gray.0"} mt={30} >
      
      <Title size="h2" ta={"center"}  c={'dark.6'} ff={'poppins'} mb={10} fw={600} lts={-2} lh={2}>
        Tasks in Progress
      </Title>
      

      {inProgressTasks.length === 0 ? (
        <Paper  py={20} px={40} bg={'orange.5'} shadow="xl" radius="md" withBorder >
        <Text fz={28} c={'gray.0'} fw={500}>Woohoo! No tasks in progress.</Text>
        </Paper>
        
      ) : (
        <Spoiler maxHeight={270} showLabel="Show more"  hideLabel="Hide">
          <ScrollArea h={500} >
          <Paper  py={20} px={40} bg={'gray.0'} shadow="xl" radius="md" withBorder >
            <Table 
              highlightOnHover
              highlightOnHoverColor="orange.1"
              horizontalSpacing="xs"
              verticalSpacing="lg"
              stickyHeader
              my={10}
            >
              <Table.Thead bg={"orange.8"} c={"gray.0"} ff={'open sans'} fz={15} p={0} >
                <Table.Tr >
                  <Table.Th w={140} >Project</Table.Th>
                  <Table.Th>Task</Table.Th>
                  {/* <Table.Th w={120}>Status</Table.Th> */}
                  <Table.Th w={180}>Deadline</Table.Th>
                  <Table.Th>Action</Table.Th>
                </Table.Tr>
              </Table.Thead >
              <Table.Tbody onClick={()=>{
                navigate(`/user-projects/${task.projectId}/task/${task.taskId}`)
              }} style={{cursor:"pointer"}} bg={"gray.0"} c={'dark.6'} ff={'poppins'}>
                {inProgressTasks.map((task) => (
                  <Table.Tr key={task.id}>
                    <Table.Td >{task.projectname}</Table.Td>
                    <Table.Td fw={600}>{task.name}</Table.Td>
                    
                    <Table.Td>{formatDeadline(task.deadline)}</Table.Td>
                    <Table.Td>
                      
                          <IoCheckmarkCircleSharp style={{ cursor: 'pointer' }} size={25} color="#2b8a3e"
                          onClick={() => {
                            setSelectedTaskId(task.id); // Set the selected task ID
                            toggle(); // Open the dialog
                          }}
                          />

                        
                      
                      <Dialog
                        opened={opened}
                        withCloseButton
                        onClose={close}
                        size="lg"
                        radius="md"
                      >
                        <Text size="sm" mb="xs" fw={500}>
                          MARK THIS TASK COMPLETED?
                        </Text>

                        <Group align="flex-end">
                          <Button
                            variant="filled"
                            color="orange.9"
                            onClick={handleMarkAsCompleted}
                          >
                            Yes
                          </Button>
                        </Group>
                      </Dialog>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            </Paper>
          </ScrollArea>
        </Spoiler>
      )}
    </Paper>
  );
};

export default InProgressTasks;
