import { Box, Flex, Paper, Stack, Title } from "@mantine/core";
import React from "react";

const YourTotalTasks = () => {
  return (
    <div>
      <Flex justify={"space-between"} align={'center'} direction={{ base: "column", sm: "row" }}>
        <Title
          size="h1"
          c={"dark.6"}
          ff={"poppins"}
          fw={600}
          lts={-2}
        >
          Your Project Stats
        </Title>

        <Flex justify={"space-between"} align={"center"} pb={15}>
            <Box mr={20} align={"center"}  px={10} py={5} >
            <Title size={40} c={"orange.8"} ff={"poppins"} fw={600} lts={-1} >
            98
          </Title> <Title size="h3" c={"dark.5"} ff={"poppins"} fw={400} lts={-2} >
            Completed Tasks
          </Title>
          </Box>
          <Box align={"center"}  px={10} py={5}>
          <Title size={40} c={"orange.8"} ff={"poppins"} fw={600} lts={-1}>
            9
          </Title>
          <Title size="h3" c={"dark.5"} ff={"poppins"} fw={400} lts={-2}>
            Completed Projects
          </Title>
          
          </Box>
          
        </Flex>
      </Flex>
    </div>
  );
};

export default YourTotalTasks;
