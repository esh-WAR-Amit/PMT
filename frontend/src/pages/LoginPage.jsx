import {
  Box,
  Button,
  Flex,
  Paper,
  PasswordInput,
  rem,
  Text,
  TextInput,
  Alert,
  Notification,
  Portal,
  LoadingOverlay,
} from "@mantine/core";
import { IconAt, IconAlertCircle } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, login, isLoading} = useAuth(); // Use the auth context
  const [visible, { toggle }] = useDisclosure(true);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });  // Redirect to home if user is logged in
    }
  }, [user, navigate]);

  if (isLoading) {
    return <div><LoadingOverlay
    visible={visible}
    zIndex={1000}
    overlayProps={{ radius: 'sm', blur: 2 }}
    loaderProps={{ color: 'orange', type: 'bars' }}
  /></div>; // Show a loading spinner or loading state
  }
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      notifications.show({
        title: "Invalid Credentials!",
        message: "Please check your email and password and try again.",
        color: "red",
        icon: <IconAlertCircle size={30} />,
        autoClose: 8000
      })
    }
  };

  return (
    <Box
      w={"100%"}
      h="100vh"
      style={{
        background: "linear-gradient(to right, #2e2e2e 50%, #e9ecef 50%)",
      }}
    >
      
      <Flex w={"100%"} h={"100%"} justify={"center"} align={"center"}>
        <Paper
          shadow="xl"
          pt={20}
          px={10}
          pb={30}
          style={{
            background: "linear-gradient(to right, #e8590c 50%, #e9ecef 50%)",
          }}
        >
          <Flex
            w={"100%"}
            direction={{ base: "column", md: "column" }}
            align={{ base: "center", md: "center" }}
            justify={{ base: "center", md: "center" }}
          >
            <Text
              size={80}
              ff="poppins"
              fw={700}
              lh={1}
              lts={-2}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  color: "#e9ecef",
                  fontWeight: 500,
                  letterSpacing: -5.6,
                }}
              >
                task
              </span>
              <span
                style={{
                  color: "#e8590c",
                  fontWeight: 700,
                  marginLeft: "0px",
                }}
              >
                PRO
              </span>
            </Text>
            <Flex direction={"column"} gap={10}>
              <TextInput
                c={"gray.0"}
                mt="md"
                withAsterisk
                rightSectionPointerEvents="none"
                rightSection={
                  <IconAt style={{ width: rem(16), height: rem(16) }} />
                }
                label="Email"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                c={"gray.0"}
                w={300}
                label="Password"
                withAsterisk
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                w={300}
                variant="gradient"
                gradient={{ from: "dark.6", to: "dark.6", deg: 90 }}
                mt={20}
                onClick={handleLogin}
              >
                Log In
              </Button>
            </Flex>
          </Flex>
        </Paper>
      </Flex>
    </Box>
    
  );
};

export default LoginPage;
