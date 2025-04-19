import api from "./config";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : "/api/auth";

export const login = async (email, password, role) => {
  try {
    const response = await api.post(`${API_URL}/${role}/login`, {
      email,
      password,
    });

    if (response.data.user?.token) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Authentication failed";
  }
};

export const logout = async () => {
  try {
    await api.post(`${API_URL}/logout`);
  } catch (error) {
    console.error("Logout error:", error);
  }

  localStorage.removeItem("user");
};

export const signup = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Signup failed";
  }
};

export const verifyEmail = async (email, otp) => {
  try {
    const response = await api.post(`${API_URL}/verify-email`, { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "OTP verification failed";
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Forgot password failed";
  }
};

export const resetPassword = async (email, otp, password) => {
  try {
    const response = await api.post(`${API_URL}/reset-password`, {
      email,
      otp,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Reset password failed";
  }
};
