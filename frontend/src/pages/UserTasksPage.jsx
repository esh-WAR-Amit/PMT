import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTasksByUserId } from "../apiService";
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Center,
  Flex,
  LoadingOverlay,
  Menu,
  Pagination,
  Paper,
  rem,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../Input.module.css";
import { IconAdjustmentsHorizontal, IconCircleCheck, IconClockX, IconDatabase, IconTrendingUp } from "@tabler/icons-react";


const UserTasksPage = () => {
    const { userId } = useParams(); // Extract userId from URL
    const [tasks, setTasks] = useState([]);    
    const [searchResults, setSearchResults] = useState([]); // For storing filtered results
    const [searchQuery, setSearchQuery] = useState(""); // Search input value
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, { toggle }] = useDisclosure(true);
    const [activePage, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all"); // New state for status filter
    const itemsPerPage = 6;
    const navigate = useNavigate()
  
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          setLoading(true);
          const data = await getTasksByUserId(userId);
          setTasks(data);
          setSearchResults(data); // Initialize search results with all tasks
          setLoading(false);
        } catch (err) {
          console.error("Error fetching tasks:", err);
          setError("Failed to load tasks");
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, [userId]); // Dependency ensures it runs again if userId changes
  
    const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);
  
      const filteredTasks = tasks.filter((task) =>
        (task.taskName.toLowerCase().includes(query) ||
          task.projectName.toLowerCase().includes(query)) &&
        (statusFilter === "all" || task.status.toLowerCase() === statusFilter)
      );
      setSearchResults(filteredTasks);
      setPage(1);
    };
  
    const handleStatusFilter = (status) => {
      setStatusFilter(status); // Update the status filter
      const filteredTasks = tasks.filter((task) =>
        (status === "all" || task.status.toLowerCase() === status.toLowerCase()) &&
        task.taskName.toLowerCase().includes(searchQuery)
      );
      setSearchResults(filteredTasks);
      setPage(1); 
    };
  
    if (loading) {
      return (
        <div>
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ color: "orange", type: "bars" }}
          />
        </div>
      );
    }
    if (error) return <p>{error}</p>;

  
    const badgeColor = (status) => {
      if (status === "completed") return "green.8";
      else if (status === "in progress") return "blue";
      else if (status === "overdue") return "red.9";
      else return "gray.1";
    };
  
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const tasksToDisplay = searchResults.slice(startIndex, endIndex);
  
    const items = [
      { title: "Your Tasks", path: `/tasks/all/${userId}` },
    ].map((item, index) => (
      <Anchor
        onClick={(e) => {
          e.preventDefault(); 
          navigate(item.path);
        }}
        key={index}
        component="button"
        lh={1.5}
      >
        {item.title}
      </Anchor>
    ));
  
    return (
      <Box mt={20} px={"md"} w={"100%"}>
        
        <Breadcrumbs
          styles={{
            breadcrumb: {
              color: "#e8590c",
              fontWeight: 600,
            },
          }}
          mb={20}
        >
          {items}
        </Breadcrumbs>
        <Title c={"dark.6"} ff={"poppins"} fw={600} lts={-2} size="h1">
          Your Tasks
        </Title>
        <Flex direction={"column"} align={{ base: "center", md: "start" }}>
        <Flex direction={"column"} align={{ base: "center", md: "start" }}>
            <Flex gap={5} w={"100%"} mt={10} >
          <TextInput
            placeholder="Search by task name or project name"
            value={searchQuery}
            onChange={handleSearch} // Trigger search on input change
            mb="md"
            classNames={{ input: classes.input }}
            w={{ base: "100%", md: "300px" }}
          />
          <Menu >
            <Menu.Target>
                <Flex bg={'orange.8'} align={"center"} px={2} h={35} style={{borderRadius: "5px", cursor: "pointer"}}> <IconAdjustmentsHorizontal color="#e9ecef"/></Flex>
              
            </Menu.Target>
            <Menu.Dropdown withBorder >
              <Menu.Item
                ff={"poppins"}
                fw={500}
                color="dark"
                leftSection={
                  <IconDatabase style={{ width: rem(18), height: rem(18) }} />
                }
                onClick={() => handleStatusFilter("all")}
              >
                All
              </Menu.Item>
              <Menu.Item
                ff={"poppins"}
                color="#2f9e44"
                fw={500}
                leftSection={
                  <IconCircleCheck style={{ width: rem(18), height: rem(18) }} />
                }
                onClick={() => handleStatusFilter("completed")}
              >
                Completed
              </Menu.Item>
              <Menu.Item
                ff={"poppins"}
                fw={500}
                color="blue"
                leftSection={
                  <IconTrendingUp style={{ width: rem(18), height: rem(18) }} />
                }
                onClick={() => handleStatusFilter("in progress")}
              >
                In Progress
              </Menu.Item>
              <Menu.Item
                ff={"poppins"}
                color="red"
                fw={500}
                leftSection={
                  <IconClockX style={{ width: rem(18), height: rem(18) }} />
                }
                onClick={() => handleStatusFilter("overdue")}
              >
                Overdue
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          </Flex>
          {tasks.length > 0 ? (
            <>
              <Flex wrap={"wrap"} gap={10} justify={{ base: "center", md: "start" }}>
                {tasksToDisplay.map((task) => (
                  <Paper style={{cursor: "pointer"}} shadow="md" withBorder p="lg" key={task.taskId} w={360} onClick={()=>{navigate(`/user-projects/${task.projectId}/task/${task.taskId}`)}}>
                    <Flex justify={"space-between"}>
                      <Flex direction={"column"} flex={2}>
                        <Title
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                          }}
                          ff={"poppins"}
                          c={"dark.6"}
                          fz={24}
                          fw={600}
                        >
                          {task.taskName}
                        </Title>
                        <Text c={"orange.8"} ff={"poppins"} fz={18} fw={500}>
                          {task.projectName}
                        </Text>
                      </Flex>
                      <Box flex={1}>
                        <Badge color={badgeColor(task.status)}> {task.status}</Badge>
                      </Box>
                    </Flex>
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                    <Text
                      ff={"poppins"}
                      fw={500}
                      c={"dark.5"}
                      fz={14}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 15,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {task.description}
                    </Text>
                  </Paper>
                ))}
              </Flex>
              
            </>
          ) : (
            <p>No tasks found for this user.</p>
          )}
        </Flex>
        <Pagination
        color="#e8590c"
                total={Math.ceil(searchResults.length / itemsPerPage)}
                value={activePage}
                onChange={setPage}
                my={20}
              />
              </Flex>
      </Box>
    );
  };
  
  export default UserTasksPage;
  