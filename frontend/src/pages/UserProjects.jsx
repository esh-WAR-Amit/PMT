import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  darken,
  Flex,
  Group,
  Image,
  Loader,
  Menu,
  Paper,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { RiSortAlphabetAsc, RiSortAlphabetDesc } from "react-icons/ri";
import { MdOutlineAutorenew } from "react-icons/md";
import classes from "../Input.module.css";
import { getProjectsByUserId } from "../apiService";
import { useNavigate } from "react-router-dom";
import utils from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";

const UserProjects = () => {
  const icon = <IoMdSearch />;
  const filterIcon = <IoFilter size={30} />;
  const aToZIcon = <RiSortAlphabetAsc />;
  const zToAIcon = <RiSortAlphabetDesc />;
  const latestIcon = <MdOutlineAutorenew />;

  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [sortOrder, setSortOrder] = useState("latest"); // For sort order
  const {user} = useAuth()
  const userId = user.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await getProjectsByUserId(userId);
        setUserProjects(projects);
      } catch (error) {
        setError("Error fetching projects for user");
        console.error("Error fetching projects for user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const imgUrl = `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-`;
  const imageUrls = [
    `${imgUrl}1.png`,
    `${imgUrl}2.png`,
    `${imgUrl}3.png`,
    `${imgUrl}4.png`,
    `${imgUrl}5.png`,
    `${imgUrl}6.png`,
    `${imgUrl}7.png`,
    `${imgUrl}8.png`,
    `${imgUrl}9.png`,
    `${imgUrl}10.png`,
  ];

  // Filtered and sorted projects based on search and sort order
  const filteredProjects = userProjects
    .filter((project) =>
      project.projectname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "aToZ") {
        return a.projectname.localeCompare(b.projectname);
      } else if (sortOrder === "zToA") {
        return b.projectname.localeCompare(a.projectname);
      } else {
        return new Date(b.updatedat) - new Date(a.updatedat);
      }
    });

  const items = [{ title: "Your Projects", path: `/user-projects` }].map(
    (item, index) => (
      <Anchor
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior
          navigate(item.path); // Navigate programmatically
        }}
        key={index}
        component="button" 
        lh={1.5}
      >
        {item.title}
      </Anchor>
    )
  );

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
        {items}
      </Breadcrumbs>
      <Title size="h1" c="dark.6" fontWeight={600} my={20}>
        Your Projects
      </Title>

      <Box h={535} pb={35}>
        <Group>
          <TextInput
            leftSectionPointerEvents="none"
            leftSection={icon}
            size="md"
            variant="default"
            radius="md"
            placeholder="Search Projects"
            classNames={{ input: classes.input }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button h={40} px={5} bg="orange.8">
                {filterIcon}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={latestIcon}
                onClick={() => setSortOrder("latest")}
              >
                Last Modified
              </Menu.Item>
              <Menu.Item
                leftSection={aToZIcon}
                onClick={() => setSortOrder("aToZ")}
              >
                Name Asc.
              </Menu.Item>
              <Menu.Item
                leftSection={zToAIcon}
                onClick={() => setSortOrder("zToA")}
              >
                Name Desc.
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {loading ? (
          <Flex justify="center" align="center" h="100%">
            <Loader color="orange" size="lg" />
          </Flex>
        ) : error ? (
          <Flex justify="center" align="center" h="100%">
            <Text color="red.8" fw={600} size="xl">
              {error}
            </Text>
          </Flex>
        ) : (
          <ScrollArea w="100%" h="95%" pt={25}>
            <Flex wrap="wrap" justify="start" gap={15}>
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.projectid}
                  shadow="sm"
                  radius="md"
                  withBorder
                  w={165}
                  onClick={() =>
                    navigate(`/user-projects/project/${project.projectid}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <Card.Section>
                    <Image
                      src={imageUrls[index % imageUrls.length]}
                      height={120}
                      alt={project.projectname}
                    />
                  </Card.Section>

                  <Flex h={'100%'} direction={'column'} align={'start'} justify={"space-between"} mt="md" mb={0}>
                    <Text fz={16} lineClamp={2} lh={1.3} c={"dark.6"} fw={500}>
                      {project.projectname}
                    </Text>
                    <Flex align={"center"} gap={2} c="dark.2" fw={500} fz={11}>
                      {latestIcon} Updated{" "}
                      {utils.timeConverter(project.updatedat)} ago
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </ScrollArea>
        )}
      </Box>
    </Box>
  );
};

export default UserProjects;
