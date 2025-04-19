import api from "./config";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const EMPLOYEE_API_URL = `${API_BASE_URL}/api/admin/employees`;
const AUTH_API_URL = `${API_BASE_URL}/api/auth/admin`;

// Get paginated list of employees
export const getEmployees = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${EMPLOYEE_API_URL}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch employees";
  }
};

// Create/register a new employee (no OTP)
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('/api/auth/admin/employee/register', employeeData);
    return response.data;
  } catch (error) {
    console.error('Employee registration error:', error.response?.data);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to register employee. Please try again.');
    }
  }
};

// Update employee details
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`${EMPLOYEE_API_URL}/${id}`, employeeData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to update employee";
  }
};

// Soft delete an employee
export const deleteEmployee = async (id, reason) => {
  try {
    const response = await api.delete(`${EMPLOYEE_API_URL}/${id}`, {
      data: { reason },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to delete employee";
  }
};

// Get employee details by ID
export const getEmployeeDetails = async (id) => {
  try {
    const response = await api.get(`${EMPLOYEE_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch employee details";
  }
};

// Search employees by query
export const searchEmployees = async (query) => {
  try {
    const response = await api.get(`${EMPLOYEE_API_URL}/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Search failed";
  }
};
