import React, { useContext, useEffect, useState } from "react";
import { getProjectMembers } from "../apiService";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Paper,
  Text,
  Title,
  Input,
  Select,
  Checkbox,
  Menu,
  Button,
  TextInput,
  rem,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowsMoveVertical,
  IconCircleCheck,
  IconDotsVertical,
  IconTrash,
  IconTrendingDown,
  IconTrendingUp,
  IconUserDown,
} from "@tabler/icons-react";
import { RiSortAlphabetAsc } from "react-icons/ri";
import classes from "../Input.module.css";
import { ProjectContext } from "../contexts/ProjectContext";
import { useAuth } from "../contexts/AuthContext";

const ProjectPageMembers = () => {
  const { projectId, members, creator } = useContext(ProjectContext);
  const { user } = useAuth();

  const loggedInUser = user.id;

  const [filteredMembers, setFilteredMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAdmins, setShowAdmins] = useState(false);

  function adminCheck(userId, members) {
    const user = members.find((member) => member.user_id === userId);
    return user ? user.user_role === "admin" : false;
  }
  const isUserAdmin = adminCheck(user.id, members);
  const isUserCreator = creator.id === user.id;

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

  return (
    <Box py={20}>
      <Text ff={"poppins"} c={"dark.4"} fz={25} fw={600} lts={-1} lh={2}>
        Project Members
      </Text>

      <Flex gap={10} wrap={"wrap"} align={"center"} mb={20}>
        <TextInput
          classNames={{ input: classes.input }}
          w={500}
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button px={5} m={0} bg="orange.8">
              <IconArrowsMoveVertical size={18} />
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              ff={"poppins"}
              fw={400}
              leftSection={<IconUserDown size={18} />}
              onClick={() => setSortBy("role")}
            >
              Admins First
            </Menu.Item>
            <Menu.Item
              ff={"poppins"}
              fw={400}
              leftSection={<RiSortAlphabetAsc size={18} />}
              onClick={() => setSortBy("name")}
            >
              Name
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Checkbox
          label="Admins Only"
          checked={showAdmins}
          color="orange.8"
          radius="xl"
          onChange={(e) => setShowAdmins(e.target.checked)}
          fw={500}
          ff={"poppins"}
        />
      </Flex>

      {/* Render Members or No Members Found */}
      {filteredMembers.length === 0 ? (
        <Text>No members found</Text>
      ) : (
        <Flex gap={10} wrap={"wrap"}>
          {filteredMembers.map((member) => (
            <Paper
              key={member.user_id}
              shadow="sm"
              radius="md"
              withBorder
              pb={10}
              px={15}
              ta={"start"}
              bg={"gray.0"}
              w={500}
              p={20}
            >
              <Flex gap={10} align={"start"} justify={"space-between"}>
                <Flex gap={14}>
                  <Avatar src={member.user_profile_pic_url} size={50} />
                  <Flex direction={"column"} justify={"start"}>
                    <Title
                      ff={"poppins"}
                      c={"dark.5"}
                      fz={20}
                      fw={600}
                      lts={-1}
                    >
                      {member.user_name}
                    </Title>
                    <Text ff={"poppins"} fz={12} fw={500} c={"dark.2"}>
                      {member.user_email}
                    </Text>
                  </Flex>
                </Flex>
                <Flex>
                  {member.user_role === "admin" && (
                    <Badge variant="outline" color="orange">
                      Admin
                    </Badge>
                  )}
                  {isUserCreator &&
  member.user_id !== creator.id &&
  member.user_id !== user.id ? (
    <Menu>
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
        {/* Creator's Options */}
        {member.user_role !== "admin" && (
          <Menu.Item
            color="#2f9e44"
            ff={"poppins"}
            fw={500}
            onClick={() =>
              console.log(`Promote ${member.user_name} to Admin`)
            }
            leftSection={<IconCircleCheck size={16} />}
          >
            Promote to Admin
          </Menu.Item>
        )}
        {member.user_role === "admin" && (
          <Menu.Item
            color="red"
            ff={"poppins"}
            fw={500}
            onClick={() =>
              console.log(`Demote ${member.user_name} to Normal`)
            }
            leftSection={<IconTrendingDown size={16} />}
          >
            Demote Admin
          </Menu.Item>
        )}
        <Menu.Item
          color="red"
          ff={"poppins"}
          fw={500}
          onClick={() =>
            console.log(`Remove ${member.user_name}`)
          }
          leftSection={<IconTrash size={16} />}
        >
          Remove User
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : <Box w={20}></Box>}

{/* Admin's Options */}
{!isUserCreator &&
  isUserAdmin &&
  member.user_role === "member" &&
  member.user_id !== creator.id &&
  member.user_id !== user.id ? (
    <Menu>
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
        <Menu.Item
          color="#2f9e44"
          ff={"poppins"}
          fw={500}
          onClick={() =>
            console.log(`Promote ${member.user_name} to Admin`)
          }
          leftSection={<IconCircleCheck size={16} />}
        >
          Promote to Admin
        </Menu.Item>
        <Menu.Item
          color="red"
          ff={"poppins"}
          fw={500}
          onClick={() =>
            console.log(`Remove ${member.user_name}`)
          }
          leftSection={<IconTrash size={16} />}
        >
          Remove User
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : null}

                </Flex>
              </Flex>
            </Paper>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default ProjectPageMembers;
