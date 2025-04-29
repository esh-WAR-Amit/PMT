import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userId = localStorage.getItem('userId');
  
      if (accessToken && refreshToken && userId) {
        try {
          // Fetch user info using the userId
          const response = await axiosInstance.get(`/api/users/${userId}`);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user details', error);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // Just reset state without clearing localStorage
        setUser(null);
        setIsAuthenticated(false);
      }
  
      setIsLoading(false);
    };
  
    checkAuth();
  }, []);
  

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      
      const { accessToken, refreshToken } = response.data.tokens;
      const { user } = response.data;

      // console.log("authcontext login: ", accessToken, refreshToken, user)

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', user.id);

      setUser(user);
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error; // Propagate error for handling in the UI
    }
  };

  // Logout function
  const logout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');

    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
