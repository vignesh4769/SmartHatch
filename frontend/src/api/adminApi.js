import api from './config';

// ✅ Use full backend URL
const API_URL = '/api/admin';

// Employee Management API

export const getEmployees = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    };
    const response = await api.get(`${API_URL}/employees`, { params });
    return response.data.employees;
  } catch (error) {
    throw { message: error.response?.data?.error || 'Failed to fetch employees', details: error.response?.data?.details };
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const config = { headers: { 'Content-Type': 'application/json' } };
const response = await api.post(`${API_URL}/employees/register`, employeeData, config);
    return response.data;
  } catch (error) {
    throw { message: error.response?.data?.error || 'Failed to create employee', details: error.response?.data?.details };
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await api.put(`${API_URL}/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw { message: error.response?.data?.error || 'Failed to update employee', details: error.response?.data?.details };
  }
};

export const deleteEmployee = async (id, reason) => {
  try {
    const response = await api.delete(`${API_URL}/employees/${id}`, {
      data: { reason }
    });
    return response.data;
  } catch (error) {
    throw { message: error.response?.data?.error || 'Failed to delete employee', details: error.response?.data?.details };
  }
};

// Employee Profile API
export const getEmployeeProfile = async () => {
  try {
    const response = await api.get(`/api/employee/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch employee profile' };
  }
};

// Employee Dashboard Stats
export const getEmployeeDashboardStats = async () => {
  try {
    const response = await api.get(`${API_URL}/employees/dashboard`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch dashboard stats' };
  }
};

// Run Management API
export const endRun = async (runId) => {
  try {
    const response = await api.put(`${API_URL}/runs/${runId}/end`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to end run' };
  }
};

// Run Management API
export const getRuns = async () => {
  try {
    const response = await api.get(`${API_URL}/runs`);
    return response.data.runs;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch runs' };
  }
};
