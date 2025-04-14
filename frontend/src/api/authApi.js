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
  const response = await api.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const registerEmployee = async (employeeData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.post('/api/auth/admin/employee/register', employeeData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

export const getEmployees = async () => {
  const response = await api.get(`${API_URL}/employees`);
  return response.data;
};

export const verifyEmail = async (email, otp) => {
  const response = await api.post(`${API_URL}/verify-email`, { email, otp });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (email, otp, password) => {
  const response = await api.post(`${API_URL}/reset-password`, {
    email,
    otp,
    password,
  });
  return response.data;
};