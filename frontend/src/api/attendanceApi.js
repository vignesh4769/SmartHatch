import api from "./config";

const API_URL = "/api/attendance";

// Fetch attendance records with pagination and filters
export const getAttendanceRecords = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch attendance records" }
    );
  }
};

// Get attendance by employee ID
export const getEmployeeAttendance = async (employeeId, startDate, endDate) => {
  try {
    const params = { startDate, endDate };
    const response = await api.get(`${API_URL}/employee/${employeeId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch employee attendance" }
    );
  }
};

// Mark attendance for an employee
export const markAttendance = async (data) => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to mark attendance" };
  }
};

// Mark bulk attendance
export const markBulkAttendance = async (data) => {
  try {
    const response = await api.post(`${API_URL}/bulk`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to mark bulk attendance" };
  }
};

// Update attendance record
export const updateAttendance = async (attendanceId, data) => {
  try {
    const response = await api.put(`${API_URL}/${attendanceId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update attendance" };
  }
};

// Get attendance statistics
export const getAttendanceStats = async (startDate, endDate) => {
  try {
    const params = { startDate, endDate };
    const response = await api.get(`${API_URL}/stats`, { params });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch attendance statistics" }
    );
  }
};

// Get today's attendance status
export const getTodayAttendance = async () => {
  try {
    const response = await api.get(`${API_URL}/today`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch today's attendance" }
    );
  }
};

// Get monthly attendance report
export const getMonthlyReport = async (month, year) => {
  try {
    const params = { month, year };
    const response = await api.get(`${API_URL}/monthly-report`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch monthly report" };
  }
};

// Get attendance records by date
export const getAttendanceByDate = async (date) => {
  try {
    const response = await api.get("/api/admin/attendance", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance:", error.response?.data);
    throw (
      error.response?.data || { error: "Failed to fetch attendance records" }
    );
  }
};

// Submit attendance records
export const submitAttendanceRecords = async (records) => {
  try {
    const response = await api.post("/api/admin/attendance/submit", { records });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to submit attendance records";
  }
};

// Get employees by hatchery
export const getEmployeesByHatchery = async (hatcheryName) => {
  try {
    const response = await api.get("/api/employees", {
      params: { hatchery: hatcheryName },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch employees";
  }
};

export default {
  getAttendanceRecords,
  getEmployeeAttendance,
  markAttendance,
  markBulkAttendance,
  updateAttendance,
  getAttendanceStats,
  getTodayAttendance,
  getMonthlyReport,
  getAttendanceByDate,
  submitAttendanceRecords,
  getEmployeesByHatchery,
};
