import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Center,
  Combobox,
  Flex,
  Group,
  Notification,
  Paper,
  ScrollArea,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectContext } from "../contexts/ProjectContext";
import { DateInput, DateTimePicker } from "@mantine/dates";
import { createTask } from "../apiService";
import classes from "../Input.module.css";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrowserCheck,
  IconPlus,
} from "@tabler/icons-react";
import { useClickOutside } from "@mantine/hooks";
import utils from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";

const AddNewTaskPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { project, admins, members } = useContext(ProjectContext);
  const [isScrollAreaVisible, setScrollAreaVisible] = useState(false);
  const {user} = useAuth()

  const overlayRef = useClickOutside(() => setScrollAreaVisible(false));

  // const loggedInUser = "fea52074-7cf8-4f6e-b1f9-e69b6b8dacdc";
  const loggedInUser = user.id
  // const loggedInUser = "31b559bc-1197-4428-b76b-bc968e57b16e";

  const isAdmin = (userId) => {
    return admins.some((admin) => admin.id === userId);
  };

  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAdmins, setShowAdmins] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: null,
    assignedMember: {},
  });

  useEffect(() => {
    let filteredList = [...members];

    // Apply search
    if (search) {
      filteredList = filteredList.filter(
        (member) =>
          member.user_name.toLowerCase().includes(search.toLowerCase()) ||
          member.user_email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (showAdmins) {
      filteredList = filteredList.filter(
        (member) => member.user_role === "admin"
      );
    }

    if (sortBy === "name") {
      filteredList = filteredList.sort((a, b) =>
        a.user_name.localeCompare(b.user_name)
      );
    } else if (sortBy === "role") {
      filteredList = filteredList.sort((a, b) =>
        a.user_role.localeCompare(b.user_role)
      );
    }

    setFilteredMembers(filteredList);
  }, [search, sortBy, showAdmins, members]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };
  const handleDateChange = (date) => {
    setFormData({ ...formData, deadline: date });
    if (error) setError("");
  };

 

  const handleCreateTask = async () => {
    const taskData = {
      name: formData.name,
      description: formData.description,
      assignedTo: formData.assignedMember.user_id,
      projectId: projectId,
      status: "in progress",
      deadline: utils.dateMantineToPostgre(formData.deadline),
    };

    try {
      const response = await createTask(taskData);
      notifications.show({
        color: "green",
        title: "Task Created Succesfully!",
        message: `A new task have successfully been added to your project.`,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const items = [
    { title: "Your Projects", path: `/user-projects` },
    {
      title: project?.name || "Project",
      path: `/user-projects/project/${projectId}`,
    },
    {
      title: "Add New Task",
      path: `/user-projects/project/${projectId}/new-task`,
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

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleFirstStep = () => {
    const taskName = formData.name.trim();

    // Validate the input
    if (taskName.length < 5 || taskName.length > 50) {
      setError("Task Name must be between 5 and 50 characters.");
      return;
    }

    // If validation passes
    setError("");
    nextStep();
  };
  const handleSecondStep = () => {
    const taskDescription = formData.description;

    // Validate the input
    if (taskDescription.length < 50) {
      setError("Task Description must be at least 50 characters.");
      return;
    }

    // If validation passes
    setError("");
    nextStep();
  };
  const handleThirdStep = () => {
    if (!formData.deadline) {
      setError("Date is required.");
      return;
    }

    nextStep();
  };
  const handleFourthStep = () => {
    if (Object.keys(formData.assignedMember).length === 0) {
      setError("Selecting a member is required.");
      notifications.show({
        color: "red",
        title: "Member not added",
        message: `Selecting a member is required.`,
      });

      setTimeout(() => {
        setError("");
      }, 4000);

      return;
    }

    handleCreateTask();
    nextStep();
  };


  const handleGenerateDescription = () => {
    const randomDescription = utils.generateRandomTaskDescription();
    setFormData({
      ...formData,
      description: randomDescription,
    });
  };

  return (
    <Box  mt={20} px={"md"} w={"100%"}>
      <Box>
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
        {!isAdmin(loggedInUser) ? (
          <Flex direction={"column"} gap={20} mt={40}>
            <Title size={32} c={"dark.6"} ff={"poppins"} fw={600} lts={-2}>
              Only Admins are allowed to add a task!
            </Title>
            <Button
              onClick={() => {
                navigate(`/user-projects/project/${projectId}`);
              }}
              leftSection={<IconArrowLeft />}
              bg={"orange.8"}
              w={250}
            >
              Back to Project
            </Button>
          </Flex>
        ) : (
          <Flex direction={"column"} gap={10}>
            <Title size={32} c={"dark.6"} ff={"poppins"} fw={600} lts={-2}>
              Add New Task
            </Title>
            <Stepper
              active={active}
              allowNextStepsSelect={false}
              color="orange.8"
              mt={10}
              iconSize={32}
              
            >
              <Stepper.Step label="First step" description="Enter Task Name" >
                <Flex direction={"column"} justify={"space-between"} h={400}>
                  <Flex direction={"column"} gap={10} w={360}>
                    <Text ff={"poppins"} fz={25} fw={600} c={"dark.4"}>
                      Task Name
                    </Text>
                    <Text ff={"poppins"} fz={13} fw={500} c={"dark.2"} mt={-16}>
                      (5-50 Characters)
                    </Text>
                    <TextInput
                      classNames={{
                        input: error
                          ? classes.inputTaskError
                          : classes.inputTask, // Conditional class
                      }}
                      maxLength={50}
                      minLength={5}
                      placeholder="Enter task name"
                      value={formData.name}
                      name="name"
                      onChange={handleInputChange}
                      withAsterisk
                      mb="sm"
                      mt={10}
                      w={300}
                      error={error} // Displays error message below the input
                    />
                  </Flex>
                  <Flex>
                    <Button
                      rightSection={<IconArrowRight />}
                      color="orange.8"
                      onClick={handleFirstStep}
                    >
                      Next
                    </Button>
                  </Flex>
                </Flex>
              </Stepper.Step>
              <Stepper.Step label="Second step" description="Enter Description">
                <Flex direction={"column"} justify={"space-between"} h={400}>
                  <Flex direction={"column"} gap={10}>
                    <Text ff={"poppins"} fz={25} fw={600} c={"dark.4"}>
                      Task Description
                    </Text>
                    <Text ff={"poppins"} fz={13} fw={500} c={"dark.2"} mt={-16}>
                      (50 Characters or more)
                    </Text>
                    <Textarea
                      classNames={{
                        input: error
                          ? classes.CreateNewProjectDescriptionInputError
                          : classes.CreateNewProjectDescriptionInput,
                      }}
                      placeholder="Enter task description"
                      value={formData.description}
                      name="description"
                      onChange={handleInputChange}
                      withAsterisk
                      
                      minLength={50}
                      error={error}
                    />
                  </Flex>
                  <Button variant="outline" w={170} color="orange.8" mt={-30} onClick={()=>{handleGenerateDescription()}}>Generate Randomly</Button>
                  <Flex gap={10}>
                    <Button
                      leftSection={<IconArrowLeft />}
                      variant="default"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button
                      rightSection={<IconArrowRight />}
                      color="orange.8"
                      onClick={handleSecondStep}
                    >
                      Next
                    </Button>
                  </Flex>
                </Flex>
              </Stepper.Step>
              <Stepper.Step label="Third step" description="Enter the Deadline">
                <Flex direction={"column"} justify={"space-between"} h={400}>
                  <Flex direction={"column"} gap={10} w={360}>
                    <Text ff={"poppins"} fz={25} fw={600} c={"dark.4"}>
                      Pick a Date
                    </Text>
                    <Text
                      ff={"poppins"}
                      fz={13}
                      fw={500}
                      c={"dark.2"}
                      mt={-16}
                    ></Text>
                    <DateInput
                    clearable
                    allowDeselect
                      valueFormat="YYYY-MM-DD"
                      value={formData.deadline}
                      onChange={handleDateChange}
                      withAsterisk
                      placeholder="Pick date and time"
                      error={error}
                      w={300}
                      minDate={new Date()}
                      classNames={{
                        input: error ? classes.inputError : classes.input,
                      }}
                    />
                  </Flex>
                  <Flex gap={10}>
                    <Button
                      leftSection={<IconArrowLeft />}
                      variant="default"
                      onClick={prevStep}
                    >
                      Back
                    </Button>
                    <Button
                      rightSection={<IconArrowRight />}
                      color="orange.8"
                      onClick={handleThirdStep}
                    >
                      Next
                    </Button>{" "}
                  </Flex>{" "}
                </Flex>
              </Stepper.Step>
              <Stepper.Step label="Final step" description="Assign Task">
                <Flex
                  gap={20}
                  mt={20}
                  align={"start"}
                  w={"100%"}
                  justify={"start"}
                  h={345}
                  direction={"column"}
                >
                  <Flex style={{ position: "relative" }}>
                    <Flex direction={"column"} gap={10} w={380}>
                      <Text ff={"poppins"} fz={25} fw={600} c={"dark.4"}>
                        Assign To
                      </Text>
                      <Text
                        ff={"poppins"}
                        fz={15}
                        fw={500}
                        c={"dark.2"}
                        mt={-15}
                      >
                        Click to Select
                      </Text>
                      {error !== "" && (
                        <Text ff={"poppins"} c={"red.8"}>
                          {error}
                        </Text>
                      )}

                      <TextInput
                        classNames={{ input: classes.input }}
                        w={380}
                        mb={10}
                        placeholder="Search by name or email"
                        value={search}
                        onFocus={() => setScrollAreaVisible(true)}
                        onChange={(e) => setSearch(e.target.value)}
                      />

                      {isScrollAreaVisible && (
                        <Box
                          ref={overlayRef}
                          
                          style={{
                            position: "absolute",
                            top: "100%", // Add some margin below the input field
                            left: 0,
                            zIndex: 1000,
                            background: "white",
                            boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            padding: "10px 0 0 0",
                            width: "380px", // Match input width
                            maxHeight: "200px", // Set max height for scrollable area
                            overflowY: "auto", // Enable vertical scrolling
                          }}
                        >
                          {filteredMembers.length === 0 ? (
                            <Text>No members found</Text>
                          ) : (
                            <ScrollArea
                              h={240}
                              w={380}
                              offsetScrollbars
                              scrollbarSize={6}
                              scrollbars="y"
                            >
                              <Flex gap={10} wrap={"wrap"} justify={"center"} w={380}>
                                {filteredMembers.map((member) => (
                                  <Paper
                                    key={member.user_id}
                                    styles={{
                                      root: {
                                        cursor: "pointer",
                                      },
                                    }}
                                    shadow="sm"
                                    radius="md"
                                    withBorder
                                    pb={10}
                                    px={15}
                                    ta={"start"}
                                    bg={"gray.0"}
                                    w={350}
                                    p={20}
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        assignedMember: member,
                                      });
                                      setScrollAreaVisible(false);
                                    }}
                                  >
                                    <Flex
                                      gap={10}
                                      align={"start"}
                                      justify={"space-between"}
                                    >
                                      <Flex gap={14}>
                                        <Avatar
                                          src={member.user_profile_pic_url}
                                          size={50}
                                        />
                                        <Flex
                                          direction={"column"}
                                          justify={"start"}
                                        >
                                          <Title
                                            ff={"poppins"}
                                            c={"dark.5"}
                                            fz={20}
                                            fw={600}
                                            lts={-1}
                                          >
                                            {member.user_name}
                                          </Title>
                                          <Text
                                            ff={"poppins"}
                                            fz={12}
                                            fw={500}
                                            c={"dark.2"}
                                          >
                                            {member.user_email}
                                          </Text>
                                        </Flex>
                                      </Flex>
                                      
                                    </Flex>
                                  </Paper>
                                ))}
                              </Flex>
                            </ScrollArea>
                          )}
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  {Object.keys(formData.assignedMember).length === 0 ? (
                    <Box></Box>
                  ) : (
                    <Flex direction={"column"} gap={10}>
                      <Text ff={"poppins"} fz={25} fw={600} c={"dark.4"}>
                        Selected Member
                      </Text>
                      <Text
                        ff={"poppins"}
                        fz={15}
                        fw={500}
                        c={"dark.2"}
                        mt={-18}
                      >
                        Click to Deselect
                      </Text>
                      <Paper
                        h={81.6}
                        style={{ cursor: "pointer" }}
                        shadow="sm"
                        radius="md"
                        withBorder
                        pb={10}
                        px={15}
                        ta={"start"}
                        bg={"orange.8"}
                        w={350}
                        p={20}
                        onClick={() => {
                          setFormData({ ...formData, assignedMember: {} });
                        }}
                      >
                        <Flex
                          gap={10}
                          align={"start"}
                          justify={"space-between"}
                        >
                          <Flex gap={14}>
                            <Avatar
                              src={formData.assignedMember.user_profile_pic_url}
                              size={50}
                            />
                            <Flex direction={"column"} justify={"start"}>
                              <Title
                                ff={"poppins"}
                                c={"gray.0"}
                                fz={20}
                                fw={600}
                                lts={-1}
                              >
                                {formData.assignedMember.user_name}
                              </Title>
                              <Text
                                ff={"poppins"}
                                fz={12}
                                fw={500}
                                c={"gray.2"}
                              >
                                {formData.assignedMember.user_email}
                              </Text>
                            </Flex>
                          </Flex>
                          
                        </Flex>
                      </Paper>
                    </Flex>
                  )}
                </Flex>
                <Flex gap={10}>
                  <Button
                    leftSection={<IconArrowLeft />}
                    variant="default"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    color="orange.8"
                    rightSection={<IconPlus />}
                    onClick={handleFourthStep}
                  >
                    Create Task
                  </Button>{" "}
                </Flex>
              </Stepper.Step>
              <Stepper.Completed>
                <Flex
                  direction={"column"}
                  justify={"space-between"}
                  h={400}
                  w={800}
                >
                  <Flex
                    direction={"column"}
                    align={"start"}
                    justify={"center"}
                    mt={50}
                  >
                    <Flex direction={{base: "column", md: "row"}} align={"center"} >
                      <IconBrowserCheck size={150} color="#e8590c" />
                      <Title ff={"poppins"} c={"dark.6"} fw={600} fz={{base: "25", md: "40"}}>
                        Task Created Successfully!
                      </Title>
                    </Flex>
                    <Button
                      mt={50}
                      onClick={() => {
                        navigate(`/user-projects/project/${projectId}`);
                      }}
                      leftSection={<IconArrowLeft />}
                      bg={"orange.8"}
                    >
                      Back to Project
                    </Button>
                  </Flex>
                </Flex>
              </Stepper.Completed>
            </Stepper>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default AddNewTaskPage;
