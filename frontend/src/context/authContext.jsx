import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const userContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return savedUser && token ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (userData) => {
    // Ensure role is always included in user data
    const completeUserData = {
      ...userData,
      role: userData.role || 'employee' // Default to employee if role not provided
    };
    
    setUser(completeUserData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify({
      _id: completeUserData._id,
      role: completeUserData.role,
      name: completeUserData.name,
      hatcheryName: completeUserData.hatcheryName
    }));
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed:", error);
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