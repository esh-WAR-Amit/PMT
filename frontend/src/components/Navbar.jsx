import {
  Avatar,
  Box,
  Button,
  Flex,
  LoadingOverlay,
  Menu,
  NavLink,
  rem,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { modals } from "@mantine/modals";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconChevronRight, IconEditCircle, IconLogout2, IconPasswordUser, IconPhotoCircle } from "@tabler/icons-react";

const Navbar = ({ onLinkClick, user }) => {
  const { logout, isLoading } = useAuth();
  const loggedInUserId = user.id;
  const navigate = useNavigate();
  const [visible, { toggle }] = useDisclosure(true);

  if (isLoading) {
    return (
      <div>
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "orange", type: "bars" }}
        />
      </div>
    ); // Show a loading spinner or loading state
  }

  const handleLogout = () => {
    modals.openConfirmModal({
      title: "Confirm Logout",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to log out of taskPRO?</Text>
      ),
      labels: { confirm: "Logout", cancel: "Cancel" },
      confirmProps: { color: "#e8590c" },
      onConfirm: () => {
        logout();
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <Flex direction={"column"} justify={"space-between"} pt={20} h={"100%"}>
      <Flex direction={"column"}>
        <NavLink
          component={RouterNavLink}
          to="/"
          label="Dashboard"
          color="orange.8"
          variant="filled"
          fw={500}
          onClick={onLinkClick}
        />
        <NavLink
          component={RouterNavLink}
          to="/project"
          label="Projects"
          color="orange.8"
          variant="filled"
          fw={500}
          defaultOpened
        >
          <NavLink
            component={RouterNavLink}
            to="/user-projects"
            label="Your Projects"
            color="orange.8"
            variant="filled"
            fw={500}
            onClick={onLinkClick}
          />
          <NavLink
            component={RouterNavLink}
            to="/projects/create"
            label="Create New Project"
            color="orange.8"
            variant="filled"
            fw={500}
            onClick={onLinkClick}
          />
        </NavLink>
        <NavLink
          component={RouterNavLink}
          to={`/tasks/all/${loggedInUserId}`}
          label="Tasks"
          color="orange.8"
          variant="filled"
          fw={500}
          onClick={onLinkClick}
        />
      </Flex>
      <Flex p align={"center"} justify={"space-between"}>
        <Menu shadow="md" withArrow position="top-end">
          <Menu.Target>
            <Flex
              
              w={"100%"}
              px={10}
              c="dark.2"
              h={50}
              style={{cursor: "pointer"
                
               }}
            >
              <Flex w={"100%"} flex={1} align={"center"} justify={"space-between"}>
                <Flex align={"center"}>
              <Avatar
                key={user?.profilepicurl}
                src={user?.profilepicurl}
                size={35}
                mr={10}
              />
              <Text ff={"poppins"} fz={15} c={"dark.6"} fw={600}>
                {user?.name}
              </Text>
              </Flex>
              <IconChevronRight style={{ width: rem(18), height: rem(18), color: "#2e2e2e" }}/>
              </Flex>
            </Flex>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="#e8590c"
              ff={"poppins"}
              fw={500}
              leftSection={
                <IconEditCircle style={{ width: rem(18), height: rem(18) }} />
              }
            >
              Change Name
            </Menu.Item>

            <Menu.Item
              color="#e8590c"
              ff={"poppins"}
              fw={500}
              leftSection={
                <IconPhotoCircle style={{ width: rem(18), height: rem(18) }} />
              }
            >
              Change Profile Photo
            </Menu.Item>

            <Menu.Item
              color="#e8590c"
              ff={"poppins"}
              fw={500}
              leftSection={
                <IconPasswordUser style={{ width: rem(18), height: rem(18) }} />
              }
            >
              Change Password
            </Menu.Item>

            <Menu.Item
              color="#e8590c"
              onClick={() => {
                handleLogout();
              }}
              ff={"poppins"}
              fw={500}
              leftSection={
                <IconLogout2 style={{ width: rem(18), height: rem(18) }} />
              }
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {/* <Tooltip label="Logout" withArrow position="right">
          <Button
            radius={"sm"}
            variant="subtle"
            color="dark.2"
            w={50}
            h={50}
            p={0}
            onClick={() => {
              handleLogout();
            }}
          >
            <IconLogout2 color="#2e2e2e" size={25} />
          </Button>
        </Tooltip> */}
      </Flex>
    </Flex>
  );
};

export default Navbar;
