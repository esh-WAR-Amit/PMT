import { BarChart, AreaChart } from "@mantine/charts";
import { Anchor, Box, Breadcrumbs, Flex, Paper, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProjectsByUserId, getProjectSummary } from "../apiService";
import InProgressTasks from "./InProgressTasks";

const ProjectProgress = () => {
  const { user } = useAuth();
  const userId = user.id;
  const [userProjects, setUserProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await getProjectSummary(userId);
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
  console.log(userProjects);

  const calculateSums = (projects) => {
    const totalTasksSum = projects.reduce(
      (sum, project) => sum + parseInt(project.total_tasks, 10),
      0
    );
    const userTasksSum = projects.reduce(
      (sum, project) => sum + parseInt(project.user_tasks, 10),
      0
    );

    const userInProgressTasksSum = projects.reduce(
      (sum, project) => sum + parseInt(project.user_in_progress_tasks, 10),
      0
    );

    return { totalTasksSum, userInProgressTasksSum, userTasksSum };
  };

  const data = userProjects.slice(0, 10).map((project) => ({
    projectName: project.projectname,
    Ongoing: parseInt(project.in_progress_tasks),
    Overdue: parseInt(project.pending_tasks),
    Completed: parseInt(project.completed_tasks),
  }));

  const { totalTasksSum, userInProgressTasksSum, userTasksSum } =
    calculateSums(userProjects);

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
        <Anchor component="button" lh={1.5}>
          Dashboard
        </Anchor>
      </Breadcrumbs>
      <Paper withBorder shadow="md" py={"md"} px={"lg"}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify={{ base: "center", md: "space-between" }}
          align={{ base: "center", md: "space-between" }}
        >
          <Title size="h1" c="dark.6" fontWeight={600} my={20}>
            Your Current Status
          </Title>
          <Flex
            justify={{ base: "center", sm: "end" }}
            align={"center"}
            pb={15}
            mr={15}
            gap={25}
          >
            <Box align={"center"}>
              <Title size={40} c={"orange.8"} ff={"poppins"} fw={600} lts={-1}>
                {userProjects.length}
              </Title>
              <Title size="h3" c={"dark.5"} ff={"poppins"} fw={400} lts={-2}>
                Projects
              </Title>
            </Box>
            <Box align={"center"}>
              <Title size={40} c={"orange.8"} ff={"poppins"} fw={600} lts={-1}>
                {userTasksSum}
              </Title>
              <Title size="h3" c={"dark.5"} ff={"poppins"} fw={400} lts={-2}>
                Tasks
              </Title>
            </Box>
            <Box align={"center"}>
              <Title size={40} c={"blue.8"} ff={"poppins"} fw={600} lts={-1}>
                {userInProgressTasksSum}
              </Title>
              <Title size="h3" c={"dark.5"} ff={"poppins"} fw={400} lts={-2}>
                Due Tasks
              </Title>
            </Box>
          </Flex>
        </Flex>
      </Paper>

      <Paper withBorder shadow="md" p={"md"} mt={30}>
      <Title size="h2" ta={"center"} c="dark.6" fontWeight={600} my={20}>
        Projects Summary
      </Title>

      <AreaChart
        h={300}
        data={data}
        dataKey="projectName"
        tooltipAnimationDuration={200}
        series={[
          { name: "Completed", color: "green.6" },
          { name: "Ongoing", color: "blue.6" },
          { name: "Overdue", color: "red.6" },
        ]}
        curveType="linear"
      />
      </Paper>

      {/* <BarChart
        h={300}
        data={data}
        dataKey="projectName"
        type="stacked"
        orientation="vertical"
        yAxisProps={{ width: 80 }}
        series={[
          { name: "Completed", color: "orange.8" },
          { name: "Ongoing", color: "orange.5" },
          { name: "Overdue", color: "orange.3" },
        ]}
      /> */}
      <InProgressTasks/>
    </Box>
  );
};

export default ProjectProgress;
