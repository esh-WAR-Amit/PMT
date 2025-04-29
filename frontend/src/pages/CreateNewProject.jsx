import {
  Box,
  Title,
  Button,
  Group,
  TextInput,
  Textarea,
  Stepper,
  Select,
  Combobox,
  PillsInput,
  Pill,
  CheckIcon,
  useCombobox,
  Avatar,
  Flex,
  Text,
  ScrollAreaAutosize,
  Paper,
  Stack,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import classes from "../Input.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { createProject, addProjectMembers, getAllUsers } from "../apiService";
import { useNavigate } from "react-router-dom";
import {IconPlus} from '@tabler/icons-react'
import {useAuth} from '../contexts/AuthContext'
import utils from "../utils/utils";

const CreateNewProject = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [projectId, setProjectId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const {user} = useAuth()

  const navigate = useNavigate();
  const loggedInUser = user.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setAllUsers(fetchedUsers);
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [value, setValue] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleValueSelect = (val) => {
    setValue((current) => {

      const updatedValue = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      const updatedSelectedUsers = updatedValue.map((email) => {
        const user = allUsers.find((user) => user.email === email);
        return user;
      });

      setSelectedUsers(updatedSelectedUsers);
      return updatedValue;
    });
  };

  const handleValueRemove = (val) => {
    setValue((current) => {

      const updatedValue = current.filter((v) => v !== val);

      const updatedSelectedUsers = updatedValue.map((email) => {
        const user = allUsers.find((user) => user.email === email);
        return user;
      });

      setSelectedUsers(updatedSelectedUsers);
      return updatedValue;
    });
  };

  const values = value.map((item) => (
    <Pill
      key={item}
      fw={500}
      c={"orange.8"}
      withRemoveButton
      onRemove={() => handleValueRemove(item)}
    >
      {item}
    </Pill>
  ));

  const options = allUsers
  .filter((item) => item.email.toLowerCase().includes(search.trim().toLowerCase()) && item.id !== loggedInUser)
  .map((item) => (
    <Combobox.Option value={item.email} key={item.id}>
      <Group gap="sm">
        {value.includes(item.email) ? (
          <CheckIcon color="green" size={12} />
        ) : null}
        <Flex align={"center"} gap={10}>
          <Avatar src={item.profilepicurl} alt={item.name} />
          <Box>
            <Text fw={500} ff={"poppins"} c={"dark.6"}>
              {item.name}
            </Text>
            <Text fw={500} fz={13} c={"dark.3"}>
              {item.email}
            </Text>
          </Box>
        </Flex>
      </Group>
    </Combobox.Option>
  ));


  const handleAddMembers = async () => {
    const userIds = selectedUsers.map((user) => user.id);

    try {
      const result = await addProjectMembers(userIds, projectId);
      console.log("Project members added successfully:", result);
      nextStep();

    } catch (error) {
      console.error("Failed to add project members:", error.message);
    }
  };

  const form = useForm({
    initialValues: {
      projectName: "",
      projectDescription: "",
      projectDeadline: null,
      projectMembers: [],
    },

    validate: {
      projectName: (value) =>
        value.length < 5 || value.length > 20
          ? "Project name must be between 5 to 20 characters"
          : null,
      projectDescription: (value) =>
        value.length < 20
          ? "Description must be at least 20 characters"
          : null,
      projectDeadline: (value) => (value ? null : "Deadline is required"),
    },

    transformValues: (values) => ({
      ...values,
      projectDeadline: values.projectDeadline
        ? new Date(values.projectDeadline)
            .toISOString()
            .replace("T", " ")
            .slice(0, -1)
        : null,
    }),
  });

  const handleCreateProject = async () => {
    const userId = loggedInUser;
    const projectData = {
      name: form.values.projectName,
      description: form.values.projectDescription,
      createdBy: userId,
      deadline: utils.dateMantineToPostgre(form.values.projectDeadline),
    };

    try {
      const response = await createProject(projectData);
      setProjectId(response.id);
      setActiveStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleGenerateDescription = () => {
    const randomDescription = utils.generateRandomTaskDescription();
    form.setFieldValue("projectDescription", randomDescription); // Updates the form state
};

  const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const prevStep = () => setActiveStep((prevStep) => prevStep - 1);


  return (
    <Box mt={20} px={"md"}>
      <Breadcrumbs
        styles={{
          breadcrumb: {
            color: "#e8590c",
            fontWeight: 600,
          },
        }}
        mb={20}
      >
        <Anchor
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior
          navigate(`/projects/create`); // Navigate programmatically
        }}
        component="button" 
        lh={1.5}
      >
        New Project
      </Anchor>
      </Breadcrumbs>
      <Title size="h1" c="dark.6" fontWeight={600} my={20}>
        Create New Project
      </Title>
      <Box  ff={'poppins'} bg={"gray.0"}  >
      <Stepper color="orange.8" active={activeStep} onStepClick={setActiveStep}  >
        {/* Step 1: Project Name */}
        <Stepper.Step label="Project Name" description="Enter project name">
            
          <form>
          <Stack  p={10} h={380} miw={400}  w={'50%'} justify="space-between" bg={"gray.0"}>
            <TextInput
              classNames={{ input: classes.input }}
              withAsterisk
              description="(5-20 Characters)"
              label="Project Title"
              placeholder="Add Project Name"
              maxLength={20}
              {...form.getInputProps("projectName")}
            />
            <Group position="right" mt="md">
              <Button bg={"orange.7"} onClick={()=>setActiveStep((prevStep) => prevStep + 1)}>Next</Button>
            </Group>
          </Stack>
          </form>
        </Stepper.Step>

        {/* Step 2: Project Description */}
        <Stepper.Step label="Project Description" description="Add description">
          <form>
          <Stack  p={10} h={380} miw={400}  w={'50%'} justify="space-between" bg={"gray.0"}>
            <Textarea
              withAsterisk
              classNames={{ input: classes.CreateNewProjectDescriptionInput }}
              description="Please enter a description below"
              label="Project Description"
              placeholder="Add Project Description"
              
              {...form.getInputProps("projectDescription")}
            />
            <Button variant="outline" w={180} color="orange.8" onClick={()=>{handleGenerateDescription()}}>Generate Randomly</Button>
            <Group position="right" mt="md">
              <Button bg={"orange.7"} onClick={prevStep}>Back</Button>
              <Button bg={"orange.7"} onClick={()=>setActiveStep((prevStep) => prevStep + 1)}>Next</Button>
            </Group>
            </Stack>
          </form>
        </Stepper.Step>

        {/* Step 3: Project Deadline */}
        <Stepper.Step label="Project Deadline" description="Set deadline">
          <form onSubmit={form.onSubmit(handleCreateProject)}>
          <Stack  p={10} h={380} miw={400}  w={'50%'} justify="space-between" bg={"gray.0"}>
            <DateTimePicker
              withAsterisk
              label="Project Deadline"
              classNames={{ input: classes.input }}
              placeholder="Enter Date"
              {...form.getInputProps("projectDeadline")}
            />
            <Group position="right" mt="md">
              <Button bg={"orange.7"} onClick={prevStep}>Back</Button>
              <Button bg={"orange.7"} leftSection={<IconPlus size={16} />} type="submit">Create Project</Button>
            </Group>
            </Stack>
          </form>
        </Stepper.Step>

        {/* Step 4: Add Members */}
        <Stepper.Step label="Add Members" description="Assign team members">
        <Stack  p={10} h={380} miw={400}  w={'50%'} justify="space-between" bg={"gray.0"}>
          <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.DropdownTarget>
              <PillsInput
                onClick={() => combobox.openDropdown()}
                classNames={{ input: classes.wrapper }}
              >
                <Pill.Group>
                  {values}

                  <Combobox.EventsTarget>
                    <PillsInput.Field
                      onFocus={() => combobox.openDropdown()}
                      onBlur={() => combobox.closeDropdown()}
                      value={search}
                      placeholder="Search Members"
                      onChange={(event) => {
                        combobox.updateSelectedOptionIndex();
                        setSearch(event.currentTarget.value);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Backspace" && search.length === 0) {
                          event.preventDefault();
                          handleValueRemove(value[value.length - 1]);
                        }
                      }}
                    />
                  </Combobox.EventsTarget>
                </Pill.Group>
              </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
              <Combobox.Options>
                <ScrollAreaAutosize type="scroll" mah={230}>
                  {options.length > 0 ? (
                    options
                  ) : (
                    <Combobox.Empty>Nothing found...</Combobox.Empty>
                  )}
                </ScrollAreaAutosize>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <Group position="right" mt="md">
            {/* <Button bg={"orange.7"} onClick={prevStep}>Back</Button> */}
            <Button bg={"orange.7"} onClick={handleAddMembers}>Finish</Button>
          </Group>
          </Stack>
        </Stepper.Step>

        {/* Step 5: Confirmation */}
        <Stepper.Completed>
          <Title mt={30} ff={'poppins'} c={'dark.6'} order={3}>Project Created Successfully!</Title>
          <Text ff={'poppins'} c="dark.3" mt={10} mb={30}>Your project and team members have been added.</Text>
          <Button bg={'orange.7'}
            onClick={() => navigate(`/user-projects/project/${projectId}`)}
          >
            {" "}
            Go to your Project
          </Button>
        </Stepper.Completed>
      </Stepper>
      </Box>
    </Box>
  );
};

export default CreateNewProject;
