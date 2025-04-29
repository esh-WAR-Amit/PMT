import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [visible, { toggle }] = useDisclosure(true);


  // Show a loading screen if authentication state is still being determined
  if (isLoading) {
    return <div><LoadingOverlay
    visible={visible}
    zIndex={1000}
    overlayProps={{ radius: 'sm', blur: 2 }}
    loaderProps={{ color: 'orange', type: 'bars' }}
  /></div>; // Show a loading spinner or loading state
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, return the child components (protected route content)
  return children;
};

export default PrivateRoute;
