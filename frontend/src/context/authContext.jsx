import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/config";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } else {
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
    }
  }, [user]);

  const login = async ({ email, password, role }) => {
    try {
      if (!role || !["admin", "employee"].includes(role)) {
        throw new Error("Invalid role specified");
      }

      const response = await api.post(`/api/auth/${role}/login`, {
        email,
        password
      });

      const userData = response.data.user;
      if (!userData || !userData.token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("user", JSON.stringify(userData));

      delete api.defaults.headers.common["Authorization"];
      api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      
      setUser(userData);
      return userData;
    } catch (error) {
      let errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      throw new Error(errorMessage);
    }
  };

  const logout = async (redirectUrl = "/login") => {
    try {
      if (user) {
        await api.post("/api/auth/logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      navigate(redirectUrl);
    }
  };

  const handleSessionExpired = (errorMessage) => {
    logout(`/login?message=${encodeURIComponent(errorMessage)}`);
  };

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorDetails = {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        };
        console.error("API error:", errorDetails);
        if (error.response?.status === 401 || error.response?.status === 403) {
          const errorMessage =
            error.response?.data?.error || "Session expired, please login again";
          handleSessionExpired(errorMessage);
          return Promise.reject(new Error(errorMessage));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === "admin",
        handleSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider };