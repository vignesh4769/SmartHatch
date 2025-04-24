import api from "./config";

const attendanceApi = {
  // Admin routes
  getAttendanceByDate: async (date) => {
    try {
      // Ensure date is a Date object and format it correctly
      const formattedDate = date instanceof Date ? date : new Date(date);
      if (isNaN(formattedDate.getTime())) {
        throw new Error('Invalid date provided');
      }

      const response = await api.get('/api/admin/attendance', { 
        params: { date: formattedDate.toISOString() } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error.response?.data || { 
        success: false,
        error: error.message || "Failed to fetch attendance by date" 
      };
    }
  },

  recordAttendance: async (data) => {
    try {
      // Ensure dates are properly formatted
      const formattedDate = new Date(data.date);
      if (isNaN(formattedDate.getTime())) {
        throw new Error('Invalid date provided');
      }

      const formattedCheckIn = data.checkIn ? new Date(data.checkIn) : null;
      if (formattedCheckIn && isNaN(formattedCheckIn.getTime())) {
        throw new Error('Invalid check-in time provided');
      }

      const response = await api.post('/api/admin/attendance', {
        ...data,
        date: formattedDate.toISOString(),
        checkIn: formattedCheckIn ? formattedCheckIn.toISOString() : null
      });
      return response.data;
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw error.response?.data || { 
        success: false,
        error: error.message || "Failed to record attendance" 
      };
    }
  },

  submitAttendanceRecords: async (data) => {
    try {
      if (!Array.isArray(data.records)) {
        throw new Error('Invalid records format');
      }

      // Ensure all dates are properly formatted
      const formattedRecords = data.records.map(record => {
        const formattedDate = new Date(record.date);
        if (isNaN(formattedDate.getTime())) {
          throw new Error('Invalid date in records');
        }

        const formattedCheckIn = record.checkIn ? new Date(record.checkIn) : null;
        if (formattedCheckIn && isNaN(formattedCheckIn.getTime())) {
          throw new Error('Invalid check-in time in records');
        }

        return {
          ...record,
          date: formattedDate.toISOString(),
          checkIn: formattedCheckIn ? formattedCheckIn.toISOString() : null
        };
      });

      const response = await api.post('/api/admin/attendance/bulk', {
        records: formattedRecords
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting attendance:', error);
      throw error.response?.data || { 
        success: false,
        error: error.message || "Failed to submit attendance records" 
      };
    }
  },

  // Employee routes
  getMyAttendance: async (month) => {
    try {
      const response = await api.get('/api/employee/attendance', { 
        params: { month } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my attendance:', error);
      throw error.response?.data || { 
        success: false,
        error: "Failed to fetch attendance records" 
      };
    }
  },

  getMonthlyReport: async (month, year) => {
    try {
      const response = await api.get('/api/employee/attendance/report', { 
        params: { month, year } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      throw error.response?.data || { 
        success: false,
        error: "Failed to fetch monthly report" 
      };
    }
  }
};

export default attendanceApi;
