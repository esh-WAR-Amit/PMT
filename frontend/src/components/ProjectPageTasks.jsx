import React, { useContext, useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Paper,
  Text,
  Title,
  Input,
  Menu,
  Checkbox,
  TextInput,
  rem,
  Center,
} from "@mantine/core";
import {
  IconArrowsMoveVertical,
  IconChevronDown,
  IconCircleCheck,
  IconClipboardPlus,
  IconClockX,
  IconDatabase,
  IconFilter,
  IconFilterBolt,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../contexts/ProjectContext";
import classes from "../Input.module.css";
import { useAuth } from "../contexts/AuthContext";

const ProjectPageTasks = () => {
  const { tasks, projectId, admins } = useContext(ProjectContext);
  const {user} = useAuth()

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const navigate = useNavigate();
  //const loggedInUser = "fea52074-7cf8-4f6e-b1f9-e69b6b8dacdc";
  const loggedInUser = user.id;
  // const loggedInUser = "31b559bc-1197-4428-b76b-bc968e57b16e";

  // Format date function
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    return `${day} ${month}`;
  }

  function isUserAdmin(userId) {
    return admins.some((admin) => admin.id === userId);
  }

  // Determine badge color based on task status
  function badgeColor(status) {
    if (status === "in progress") return "blue";
    if (status === "completed") return "green.8";
    if (status === "overdue") return "red";
    return "gray";
  }

  // Apply filters and search
  useEffect(() => {
    let filteredList = [...tasks];

    if (myTasksOnly) {
      filteredList = filteredList.filter(
        (task) => task.assigned_to_user_id === loggedInUser
      );
    }

    if (search) {
      filteredList = filteredList.filter((task) =>
        task.task_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filteredList = filteredList.filter(
        (task) => task.task_status === statusFilter
      );
    }

    setFilteredTasks(filteredList);
  }, [tasks, search, statusFilter, myTasksOnly, loggedInUser]);

  const handleTaskClick = (taskId) => {
    navigate(`/user-projects/${projectId}/task/${taskId}`);
  };

  return (
    <Box shadow="xl" radius="md" bg={"gray.0"}  p={20}>
      <Title ff={"poppins"} c={"dark.4"} fz={25} fw={600} lts={-1} lh={2}>
        Tasks
      </Title>

      <Flex gap={10} wrap={"wrap"} align={"center"} mb={20}>
        {/* Search Input */}
        <TextInput
          classNames={{ input: classes.input }}
          w={{base: "331.6", md:"500"}}
          placeholder="Search tasks by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Status Menu */}
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Button
              rightSection={<IconChevronDown size={18} />}
              style={{ textTransform: "uppercase" }}
              bg="orange.8"
            >
              {statusFilter}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              ff={"poppins"}
              fw={500}
              color="dark"
              leftSection={
                <IconDatabase style={{ width: rem(18), height: rem(18) }} />
              }
              onClick={() => setStatusFilter("all")}
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
              onClick={() => setStatusFilter("completed")}
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
              onClick={() => setStatusFilter("in progress")}
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
              onClick={() => setStatusFilter("overdue")}
            >
              Overdue
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {/* My Tasks Only Checkbox */}
        <Checkbox
          label="My Tasks Only"
          checked={myTasksOnly}
          onChange={(e) => setMyTasksOnly(e.target.checked)}
          color="orange.8"
          radius="xl"
          fw={500}
          ff={"poppins"}
        />
      </Flex>

      {/* Render Tasks */}
      <Flex >
        {filteredTasks === null ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <Box mih={260}>
            {isUserAdmin(loggedInUser) && (
              <Paper
              style={{
                cursor: "pointer",
                backgroundColor: "#e8590c",
                maxWidth: "100%",
                width: 331.6,
                height: 122.05,
                transition: "all 0.1s ease",
              }}
              shadow="sm"
              radius="md"
              withBorder
              pb={10}
              px={15}
              ta={"start"}
              w={331.6}
              h={122.05}
              onClick={() => {
                navigate(`/user-projects/project/${projectId}/new-task`);
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f76707")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#e8590c")
              }
              >
                <Flex
                  align={"center"}
                  gap={10}
                  justify={"center"}
                  w={"100%"}
                  h={"100%"}
                >
                  <Text ff={"poppins"} fw={600} fz={30} c={"gray.0"}>
                    Add New Task
                  </Text>
                  <IconClipboardPlus color="#f8f9fa" size={50} />
                </Flex>
              </Paper>
            )}
            <Title
              ff={"poppins"}
              c={"dark.4"}
              fz={20}
              mt={20}
              fw={600}
              lts={-1}
              lh={2}
            >
              No tasks found.
            </Title>
          </Box>
        ) : (
          <Flex
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
            mih={260}
          >
            {isUserAdmin(loggedInUser) && (
              <Paper
                style={{
                  cursor: "pointer",
                  backgroundColor: "#e8590c",
                  transition: "all 0.1s ease",
                }}
                shadow="sm"
                radius="md"
                withBorder
                pb={10}
                px={15}
                ta={"start"}
                w={331.6}
                h={122.05}
                onClick={() => {
                  navigate(`/user-projects/project/${projectId}/new-task`);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f76707")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e8590c")
                }
              >
                <Flex
                  align={"center"}
                  gap={10}
                  justify={"center"}
                  w={"100%"}
                  h={"100%"}
                >
                  <Text ff={"poppins"} fw={600} fz={30} c={"gray.0"}>
                    Add New Task
                  </Text>
                  <IconClipboardPlus color="#f8f9fa" size={50} />
                </Flex>
              </Paper>
            )}

            {filteredTasks.map((task, index) => (
              <Paper
                style={{ cursor: "pointer" }}
                onClick={() => handleTaskClick(task.task_id)}
                key={task.task_id || `task-${index}`}
                shadow="sm"
                radius="md"
                withBorder
                pb={10}
                px={15}
                ta={"start"}
                bg={"gray.0"}
              >
                <Flex
                  justify="flex-start"
                  align="center"
                  direction="row"
                  gap={10}
                >
                  <Title
                    ff={"poppins"}
                    c={"dark.5"}
                    fz={20}
                    fw={600}
                    lts={-1}
                    lh={2}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "190px",
                    }}
                  >
                    {task.task_name}
                  </Title>
                  <Badge color={badgeColor(task.task_status)} size="md">
                    {task.task_status}
                  </Badge>
                </Flex>
                <Text
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "normal",
                    overflow: "hidden",
                  }}
                  ff={"poppins"}
                  fz={12}
                  fw={500}
                  mb={10}
                  c={"dark.2"}
                  lineClamp={2}
                >
                  {task.task_description}
                </Text>
                <Flex
                  justify="space-between"
                  align="center"
                  direction="row"
                  gap={9}
                >
                  <Flex gap={5}>
                  <Avatar
                    size={18}
                    src={task.assigned_user_profile_pic}
                    alt={task.assigned_user_name}
                  />
                  <Text
                    ff={"poppins"}
                    fz={15}
                    fw={500}
                    c={"dark.4"}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "88px",
                    }}
                  >
                     {`${task.assigned_user_name.split(' ')[0]} ${
    task.assigned_user_name.split(' ')[1]?.charAt(0) || ''
  }.`}
                  </Text>
                  </Flex>
                  <Badge
                    variant="dot"
                    color="orange.8"
                    style={{ color: "#e8590c" }}
                    size="md"
                  >
                    Deadline: {formatDate(task.task_deadline)}
                  </Badge>
                </Flex>
              </Paper>
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default ProjectPageTasks;
