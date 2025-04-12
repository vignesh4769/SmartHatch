import api from './config';

const API_URL = '/api/runs';

// Fetch all runs with pagination and filters
export const getRuns = async (page = 1, limit = 10, filters = {}) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    };
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch runs' };
  }
};

// Get single run details
export const getRunById = async (runId) => {
  try {
    const response = await api.get(`${API_URL}/${runId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch run details' };
  }
};

// Create new run
export const createRun = async (runData) => {
  try {
    const response = await api.post(API_URL, runData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create run' };
  }
};

// Update run
export const updateRun = async (runId, runData) => {
  try {
    const response = await api.put(`${API_URL}/${runId}`, runData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update run' };
  }
};

// Delete run
export const deleteRun = async (runId) => {
  try {
    const response = await api.delete(`${API_URL}/${runId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete run' };
  }
};

// Add employee to run
export const addEmployeeToRun = async (runId, employeeId) => {
  try {
    const response = await api.post(`${API_URL}/${runId}/employees`, { employeeId });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to add employee to run' };
  }
};

// Remove employee from run
export const removeEmployeeFromRun = async (runId, employeeId) => {
  try {
    const response = await api.delete(`${API_URL}/${runId}/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to remove employee from run' };
  }
};

// Update run status
export const updateRunStatus = async (runId, status) => {
  try {
    const response = await api.patch(`${API_URL}/${runId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update run status' };
  }
};

// Get run statistics
export const getRunStatistics = async (runId) => {
  try {
    const response = await api.get(`${API_URL}/${runId}/statistics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch run statistics' };
  }
};

export default {
  getRuns,
  getRunById,
  createRun,
  updateRun,
  deleteRun,
  addEmployeeToRun,
  removeEmployeeFromRun,
  updateRunStatus,
  getRunStatistics
};