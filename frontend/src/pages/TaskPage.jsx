import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Text,
  Title,
  Breadcrumbs,
  Anchor,
  Tooltip,
  Menu,
  rem,
  Divider,
  TextInput,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { TaskContext } from "../contexts/TaskContext.jsx";
import { modals } from "@mantine/modals";
import {
  changeTaskDeadline,
  changeTaskDescription,
  changeTaskName,
  deleteTask,
  markTaskCompleted,
} from "../apiService.js";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconCheck,
  IconCircleCheck,
  IconClockX,
  IconDotsVertical,
  IconEdit,
  IconEditCircle,
  IconTrash,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import classes from "../Input.module.css";
import utils from "../utils/utils.js";
import { DateInput } from "@mantine/dates";

const TaskPage = () => {
  const { task, admins, loading, error, setTaskData, projectId } =
    useContext(TaskContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const loggedInUser = user.id;

  //Editing Title
  const [editedTitle, setEditedTitle] = useState("");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  useEffect(() => {
    if (task && task.length > 0) {
      setEditedTitle(task[0]?.task_name || "");
    }
  }, [task]);

  const handleNameInputChange = (e) => {
    const { value } = e.target;
    setEditedTitle(value);
  };

  const handleTaskNameChange = async (taskId, name) => {
    try {
      const updatedTask = await changeTaskName(taskId, name);

      setTaskData((prevData) => ({
        ...prevData,
        task: prevData.task.map((taskItem) =>
          taskItem.task_id === taskId
            ? { ...taskItem, task_name: name }
            : taskItem
        ),
      }));
      setIsTitleEditing(false);
      notifications.show({
        color: "green",
        title: "Success!",
        message: "Task Name Updated Successfully.",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  //Editing Description

  const [editedDescription, setEditedDescription] = useState("");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  useEffect(() => {
    if (task && task.length > 0) {
      setEditedDescription(task[0]?.task_description || "");
    }
  }, [task]);

  const handleDescriptionInputChange = (e) => {
    const { value } = e.target;
    setEditedDescription(value);
  };

  const handleTaskDescriptionChange = async (taskId, description) => {
    try {
      const updatedTask = await changeTaskDescription(taskId, description);

      setTaskData((prevData) => ({
        ...prevData,
        task: prevData.task.map((taskItem) =>
          taskItem.task_id === taskId
            ? { ...taskItem, task_description: description }
            : taskItem
        ),
      }));
      setIsDescriptionEditing(false);
      notifications.show({
        color: "green",
        title: "Success!",
        message: "Description Updated Successfully.",
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  //Editing Deadline

  const [editedDeadline, setEditedDeadline] = useState("");
  const [isDeadlineEditing, setIsDeadlineEditing] = useState(false);

  const handleTaskDeadlineChange = async (taskId, deadline) => {
    try {
      const formattedDeadline = utils.dateMantineToPostgre(deadline);
      const updatedTask = await changeTaskDeadline(taskId, formattedDeadline);

      setTaskData((prevData) => ({
        ...prevData,
        task: prevData.task.map((taskItem) =>
          taskItem.task_id === taskId
            ? { ...taskItem, task_deadline: formattedDeadline }
            : taskItem
        ),
      }));
      setIsDeadlineEditing(false);
      notifications.show({
        color: "green",
        title: "Success!",
        message: "Deadline Updated Successfully.",
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Helper functions
  function badgeColor(status) {
    if (status === "in progress") return "blue";
    if (status === "completed") return "green.8";
    if (status === "overdue") return "red.9";
    return "gray";
  }

  function isAssignedUser(userId) {
    return userId === task.task_assigned_to;
  }

  function isUserAdmin(userId) {
    return admins.some((admin) => admin.id === userId);
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    return `${day} ${month}`;
  }

  const handleChangeStatus = async (taskId, status) => {
    try {
      const updatedTask = await markTaskCompleted(taskId, status);

      setTaskData((prevData) => ({
        ...prevData,
        task: prevData.task.map((taskItem) =>
          taskItem.task_id === taskId
            ? { ...taskItem, task_status: status }
            : taskItem
        ),
      }));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this task?",
      children: (
        <Text size="sm">
          Once this task is deleted it can not be recovered.
        </Text>
      ),
      centered: true,
      labels: { confirm: "Yes", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        handleTaskDelete(task[0].task_id);
      },
    });

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);

      notifications.show({
        color: "green",
        title: "Task Deleted Successfully",
        message: "Redirecting to the Project Page now.",
      });

      setTimeout(() => {
        navigate(`/user-projects/project/${projectId}`);
      }, 700);
    } catch (error) {
      console.error("Error deleting task.", error);

      // Show error notification
      notifications.show({
        color: "red",
        title: "Error Deleting Task",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  const items = [
    { title: "Your Projects", path: `/user-projects` },
    {
      title: task?.[0]?.project_name || "Project",
      path: `/user-projects/project/${projectId}`,
    },
    {
      title: task?.[0]?.task_name || "Task",
      path: `/user-projects/${projectId}/task/${task?.[0]?.task_id}`,
    },
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Oops! {error}. Please try again</div>;
  if (!task) return <div>No task data found</div>;

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
      <Flex align={"start"}>
        <Flex direction={"column"} flex={1}>
          {isTitleEditing ? (
            <Flex
              gap={10}
              direction={{ base: "column", md: "row" }}
              align={"center"}
            >
              <TextInput
                value={editedTitle}
                variant="unstyled"
                maxLength={20}
                minLength={5}
                onChange={handleNameInputChange}
                classNames={{
                  input: classes.editTaskNameInput,
                }}
              />
              <Flex gap={10}>
                <Tooltip label="Save" withArrow>
                  <Button
                    onClick={() => {
                      handleTaskNameChange(task[0].task_id, editedTitle);
                    }}
                    p={5}
                    variant="filled"
                    color="blue"
                  >
                    <IconCheck />
                  </Button>
                </Tooltip>
                <Tooltip withArrow label="Cancel">
                  <Button
                    p={5}
                    variant="filled"
                    color="red"
                    onClick={() => {
                      setIsTitleEditing(false);
                    }}
                  >
                    <IconX />
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>
          ) : (
            <Title size={32} c={"dark.6"} ff={"poppins"} fw={600} lts={-2}>
              {task[0].task_name}
            </Title>
          )}

          <Text c={"orange.8"} fz={22} ff={"poppins"} fw={600} mb={15}>
            {task[0].project_name}
          </Text>
        </Flex>
        <Flex align={"center"} mt={5} mr={15}>
          <Badge color={badgeColor(task[0].task_status)}>
            {task[0].task_status}
          </Badge>
          {(isUserAdmin(loggedInUser) || isAssignedUser(loggedInUser)) && (
            <Menu width={200} shadow="lg">
              <Menu.Target>
                <Tooltip label="Options" withArrow position="top">
                  <IconDotsVertical
                    color="#424242"
                    size={20}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Change Status</Menu.Label>
                <Menu.Item
                  onClick={() => {
                    handleChangeStatus(task[0].task_id, "completed");
                  }}
                  color="#2f9e44"
                  ff={"poppins"}
                  fw={500}
                  leftSection={
                    <IconCircleCheck
                      style={{ width: rem(18), height: rem(18) }}
                    />
                  }
                >
                  Completed
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    handleChangeStatus(task[0].task_id, "in progress");
                  }}
                  color="blue"
                  ff={"poppins"}
                  fw={500}
                  leftSection={
                    <IconTrendingUp
                      style={{ width: rem(18), height: rem(18) }}
                    />
                  }
                >
                  In progress
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    handleChangeStatus(task[0].task_id, "overdue");
                  }}
                  color="red"
                  ff={"poppins"}
                  fw={500}
                  leftSection={
                    <IconClockX style={{ width: rem(18), height: rem(18) }} />
                  }
                >
                  Overdue
                </Menu.Item>
                {isUserAdmin(loggedInUser) && (
                  <Box>
                    <Menu.Divider />

                    <Menu.Label>Admin Options</Menu.Label>
                    <Menu.Item
                      onClick={() => {
                        setIsTitleEditing(true);
                      }}
                      color="#343a40"
                      ff={"poppins"}
                      fw={500}
                      leftSection={
                        <IconEditCircle
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      }
                    >
                      Edit Name
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        setIsDescriptionEditing(true);
                      }}
                      color="#343a40"
                      ff={"poppins"}
                      fw={500}
                      leftSection={
                        <IconEditCircle
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      }
                    >
                      Edit Description
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        setIsDeadlineEditing(true);
                      }}
                      color="#343a40"
                      ff={"poppins"}
                      fw={500}
                      leftSection={
                        <IconEditCircle
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      }
                    >
                      Edit Deadline
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        openDeleteModal();
                      }}
                      color="red"
                      ff={"poppins"}
                      fw={500}
                      leftSection={
                        <IconTrash
                          style={{ width: rem(18), height: rem(18) }}
                        />
                      }
                    >
                      Delete
                    </Menu.Item>
                  </Box>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
      </Flex>
      <Flex gap={5} align={"center"} mb={20}>
        <Text c={"dark.4"} fz={21} ff={"poppins"} fw={500}>
          Assigned to:{" "}
        </Text>
        <Avatar src={task[0].user_profile_pic_url} size={24} />
        <Text c={"dark.4"} fz={21} ff={"poppins"} fw={500}>
          {task[0].user_name}
        </Text>
      </Flex>

      {isDeadlineEditing ? (
        <Flex gap={10}>
          <DateInput value={editedDeadline} onChange={setEditedDeadline} placeholder="Select New Date" />
          <Flex gap={10}>
            <Tooltip label="Save" withArrow>
              <Button
                onClick={() => {
                  handleTaskDeadlineChange(task[0].task_id, editedDeadline);
                }}
                p={5}
                variant="filled"
                color="blue"
              >
                <IconCheck />
              </Button>
            </Tooltip>
            <Tooltip withArrow label="Cancel">
              <Button
                p={5}
                variant="filled"
                color="red"
                onClick={() => {
                  setIsDeadlineEditing(false);
                }}
              >
                <IconX />
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      ) : (
        <Badge
          variant="dot"
          color="orange.8"
          style={{ color: "#e8590c" }}
          size="lg"
        >
          Task Deadline: {formatDate(task[0].task_deadline)}
        </Badge>
      )}
      <Divider mt={15} size="md" />
      <Flex align={"center"}>
        <Title
          ff="poppins"
          c="dark.4"
          fz={25}
          fw={600}
          px={15}
          pt={15}
          lts={-1}
          lh={2}
        >
          Description
        </Title>
        {isDescriptionEditing && (
          <Flex gap={10}>
            <Tooltip label="Save" withArrow>
              <Button
                onClick={() => {
                  handleTaskDescriptionChange(
                    task[0].task_id,
                    editedDescription
                  );
                }}
                p={5}
                variant="filled"
                color="blue"
              >
                <IconCheck />
              </Button>
            </Tooltip>
            <Tooltip withArrow label="Cancel">
              <Button
                p={5}
                variant="filled"
                color="red"
                onClick={() => {
                  setIsDescriptionEditing(false);
                }}
              >
                <IconX />
              </Button>
            </Tooltip>
          </Flex>
        )}
      </Flex>

      {isDescriptionEditing ? (
        <Textarea
          value={editedDescription}
          variant="unstyled"
          onChange={handleDescriptionInputChange}
          classNames={{
            input: classes.editTaskDescriptionInput,
          }}
        />
      ) : (
        <Text
          c={"dark.6"}
          ff={"poppins"}
          fz={16}
          px={15}
          pb={15}
          fw={500}
          maw={"100%"}
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word", // Ensures long words wrap
            overflowWrap: "break-word",
          }}
        >
          {task[0].task_description}
        </Text>
      )}

      <Flex gap={5}>
        <Button
          onClick={() => {
            navigate(`/user-projects/project/${projectId}`);
          }}
          variant="outline"
          mb={20}
          color="orange.8"
          leftSection={<IconArrowLeft size={14} />}
        >
          Back to: {task[0].project_name}
        </Button>
      </Flex>
    </Box>
  );
};

export default TaskPage;
