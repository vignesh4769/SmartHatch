import axios from 'axios';
import { getAuthHeader } from './authApi';

// ✅ Use full backend URL
const API_URL = 'http://localhost:5000/api/admin';

// Employee Management API

export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`, getAuthHeader());
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await axios.post(`${API_URL}/employees/register`, employeeData, getAuthHeader());
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, getAuthHeader());
  return response.data;
};

export const deleteEmployee = async (id, reason) => {
  const response = await axios.delete(`${API_URL}/employees/${id}`, {
    ...getAuthHeader(),
    data: { reason },
  });
  return response.data;
};
