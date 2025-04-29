import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { replace, useNavigate } from 'react-router-dom';


const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();  // Call the logout function from context
    navigate('/login', { replace: true });  // Redirect to the login page
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
