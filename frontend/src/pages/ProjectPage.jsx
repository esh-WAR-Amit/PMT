import React, { useContext, useEffect, useState } from "react";
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  Tabs,
  Textarea,
  Title,
  Text,
  Tooltip,
  rem,
  TextInput,
} from "@mantine/core";
import {
  IconMessageCircle,
  IconUsersGroup,
  IconFileDescription,
  IconDotsVertical,
  IconEditCircle,
  IconTrash,
  IconClockX,
  IconTrendingUp,
  IconCircleCheck,
  IconHexagonPlus,
  IconUsers,
  IconClockEdit,
  IconX,
  IconCheck,
  IconEyeEdit,
} from "@tabler/icons-react";
import ProjectPageDescription from "../components/ProjectPageDescription";
import ProjectPageTasks from "../components/ProjectPageTasks";
import ProjectPageProgressBar from "../components/ProjectPageProgressBar";
import ProjectPageMembers from "../components/ProjectPageMembers";
import { ProjectContext, ProjectProvider } from "../contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import { changeProjectDeadline, changeProjectDescription, changeProjectName, changeProjectStatus, deleteProject } from "../apiService";
import { modals } from "@mantine/modals";
import { DateInput, DatePicker, DateTimePicker } from "@mantine/dates";
import classes from "../Input.module.css";
import utils from "../utils/utils";
import { notifications } from "@mantine/notifications";


const ProjectPageContent = () => {
  const {
    project,
    tasks,
    admins,
    creator,
    members,
    loading,
    error,
    projectId,
    setProjectData,
  } = useContext(ProjectContext);
  

  const loggdInUser = localStorage.getItem("userId");


// Deadline Change
  const [editedDeadline, setEditedDeadline] = useState("");
  const [isDeadlineEditing, setIsDeadlineEditing] = useState(false);

  const handleProjectDeadlineChange = async (projectId, deadline) => {
    try {
      const formattedDeadline = utils.dateMantineToPostgre(deadline);
      const updatedProject = await changeProjectDeadline(projectId, formattedDeadline);

      setProjectData((prevData) => ({
        ...prevData,
        project:
          prevData.project.id === projectId
            ? { ...prevData.project, ...updatedProject }
            : prevData.project, // If the ID doesn't match, return the existing project
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

  //Title CHange

  const [editedTitle, setEditedTitle] = useState("");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  useEffect(() => {
    if (project) {
      setEditedTitle(project.name || "");
    }
  }, [project]);

  const handleNameInputChange = (e) => {
    const { value } = e.target;
    setEditedTitle(value);
  };

  const handleProjectNameChange = async (projectId, name) => {
    try {
      const updatedProject = await changeProjectName(projectId, name);

      setProjectData((prevData) => ({
        ...prevData,
        project:
          prevData.project.id === projectId
            ? { ...prevData.project, ...updatedProject }
            : prevData.project, // If the ID doesn't match, return the existing project
      }));
      setIsTitleEditing(false);
      notifications.show({
        color: "green",
        title: "Success!",
        message: "Project Name Updated Successfully.",
      });
    } catch (error) {
      console.error("Error updating Project:", error);
    }
  };


  // Description Change

  const [editedDescription, setEditedDescription] = useState("");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  useEffect(() => {
    if (project) {
      setEditedDescription(project.description || "");
    }
  }, [project]);

  const handleDescriptionInputChange = (e) => {
    const { value } = e.target;
    setEditedDescription(value);
  };

  const handleProjectDescriptionChange = async (projectId, description) => {
    try {
      const updatedProject = await changeProjectDescription(projectId, description);

      setProjectData((prevData) => ({
        ...prevData,
        project:
          prevData.project.id === projectId
            ? { ...prevData.project, ...updatedProject }
            : prevData.project, // If the ID doesn't match, return the existing project
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

//delete

const openDeleteModal = () =>
  modals.openConfirmModal({
    title: "Are you sure you want to delete this project?",
    children: (
      <Text size="sm">
        Once this project is deleted it can not be recovered.
      </Text>
    ),
    centered: true,
    labels: { confirm: "Yes", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: () => {
      handleProjectDelete(projectId);
    },
  });

  const handleProjectDelete = async (projectId) => {
    try {
      await deleteProject(projectId);

      notifications.show({
        color: "green",
        title: "Project Deleted Successfully",
        message: "Redirecting to the Home Page now.",
      });

      setTimeout(() => {
        navigate(`/`);
      }, 700);
    } catch (error) {
      console.error("Error deleting project.", error);

      notifications.show({
        color: "red",
        title: "Error Deleting Task",
        message: "Something went wrong. Please try again.",
      });
    }
  };





  function isUserAdmin(userId) {
    return admins.some((admin) => admin.id === userId);
  }

  const navigate = useNavigate();

  const items = [
    { title: "Your Projects", path: `/user-projects` },
    {
      title: project?.name || "Project",
      path: `/user-projects/project/${projectId}`,
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
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    return `${day} ${month}`;
  }

  const handleChangeStatus = async (projectId, status) => {
    try {
      const updatedProject = await changeProjectStatus(projectId, status);

      // Update the project state immutably
      setProjectData((prevData) => ({
        ...prevData,
        project:
          prevData.project.id === projectId
            ? { ...prevData.project, ...updatedProject }
            : prevData.project, // If the ID doesn't match, return the existing project
      }));
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  





  if (loading) {
    return (
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "orange", type: "bars" }}
      />
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const iconStyle = { width: rem(14), height: rem(14) };

  function badgeGradient(status) {
    if (status === "active") {
      return { from: "blue.5", to: "blue.8", deg: 88 };
    }
    if (status === "completed") {
      return { from: "green.5", to: "green.9", deg: 90 };
    }
    if (status === "overdue") {
      return { from: "orange.6", to: "red.9", deg: 78 };
    }
    return { from: "gray.4", to: "gray.6", deg: 90 }; // Default gradient for undefined status
  }

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
      <Flex justify={"space-between"} align={"start"}>
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
                      handleProjectNameChange(projectId, editedTitle);
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
          {project.name}
        </Title>
          )}

        
        <Flex gap={10}>
          <Badge
            autoContrast
            size="md"
            variant="gradient"
            gradient={badgeGradient(project.status)}
          >
            {project.status}
          </Badge>
          {isUserAdmin(loggdInUser) && (
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
                    handleChangeStatus(projectId, "completed");
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
                    handleChangeStatus(projectId, "active");
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
                  Active
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    handleChangeStatus(projectId, "overdue");
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
                <Box>
                  <Menu.Divider />

                  <Menu.Label>More Options</Menu.Label>
                  <Menu.Item
                    onClick={() => {
                      console.log("Edit Option Selected");
                    }}
                    color="#343a40"
                    ff={"poppins"}
                    fw={500}
                    leftSection={
                      <IconUsers
                        style={{ width: rem(18), height: rem(18) }}
                      />
                    }
                  >
                    Manage Members
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      navigate(`/user-projects/project/${projectId}/new-task`)
                    }}
                    color="#343a40"
                    ff={"poppins"}
                    fw={500}
                    leftSection={
                      <IconHexagonPlus
                        style={{ width: rem(18), height: rem(18) }}
                      />
                    }
                  >
                    Add New Task
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setIsDeadlineEditing(true)
                    }}
                    color="#343a40"
                    ff={"poppins"}
                    fw={500}
                    leftSection={
                      <IconClockEdit
                        style={{ width: rem(18), height: rem(18) }}
                      />
                    }
                  >
                    Change Deadline
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      setIsTitleEditing(true);
                    }}
                    color="#343a40"
                    ff={"poppins"}
                    fw={500}
                    leftSection={
                      <IconEyeEdit
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
                  onClick={()=>{openDeleteModal()}}
                    color="red"
                    ff={"poppins"}
                    fw={500}
                    leftSection={
                      <IconTrash style={{ width: rem(18), height: rem(18) }} />
                    }
                  >
                    Delete
                  </Menu.Item>
                </Box>
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
      </Flex>

      {isDeadlineEditing? <Flex mt={10} gap={10}>
          <DateInput value={editedDeadline} onChange={setEditedDeadline} placeholder="Select New Date" />
          <Flex gap={10}>
            <Tooltip label="Save" withArrow>
              <Button
                onClick={() => {
                  handleProjectDeadlineChange(projectId, editedDeadline);
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
        </Flex> : 

      <Badge
        mt={10}
        variant="dot"
        color="orange.8"
        style={{ color: "#e8590c" }}
        size="lg"
      >
        Deadline: {formatDate(project.deadline)}
      </Badge>
      }

      <Tabs color="orange" defaultValue="description" mt={10}>
        <Tabs.List>
          <Tabs.Tab
            value="description"
            px={10}
            leftSection={<IconFileDescription style={iconStyle} />}
          >
            Dashboard
          </Tabs.Tab>
          <Tabs.Tab
            value="messages"
            px={10}
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Discussion
          </Tabs.Tab>
          <Tabs.Tab
            value="members"
            px={10}
            leftSection={<IconUsersGroup style={iconStyle} />}
          >
            Members
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="description">
          <ProjectPageProgressBar />
          {isDescriptionEditing ? 
          <Box flex={1}  shadow="xl" radius="md" m={20} >
          <Flex align={"center"} gap={10}>
            <Title ff="poppins" c="dark.4" fz={25} fw={600} lts={-1} lh={2}>
              Description
            </Title>
            <Flex gap={10}>
            <Tooltip label="Save" withArrow>
              <Button
                onClick={() => {
                  handleProjectDescriptionChange(projectId, editedDescription);
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
            </Flex>
          <Textarea
          value={editedDescription}
          variant="unstyled"
          onChange={handleDescriptionInputChange}
          classNames={{
            input: classes.editProjectDescriptionInput,
          }}
          
        /> </Box> :
          <ProjectPageDescription />
}
          <ProjectPageTasks />
        </Tabs.Panel>

        <Tabs.Panel value="messages">
          <Chat />
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <ProjectPageMembers />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
};

// Wrap with ProjectProvider
const ProjectPage = () => (
  <ProjectProvider>
    <ProjectPageContent />
  </ProjectProvider>
);

export default ProjectPage;
