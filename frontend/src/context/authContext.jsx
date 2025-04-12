import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import api from '../api/config';

const userContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (userData) => {
    try {
      if (!userData || !userData.token) {
        throw new Error('Invalid login response');
      }

      const { token, _id, role, name, hatcheryName, email } = userData;
      
      // Create user object with all necessary data
      const userToStore = {
        _id,
        role: role || 'employee',
        name,
        hatcheryName,
        email,
        token
      };
      
      // Store user data and update state
      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <userContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAdmin: user?.role === 'admin' // Additional helper
    }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;