import api from './config';

const messApi = {
  // Get mess schedules for a date range
  getMessSchedules: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/api/mess/schedule', { params });
    return response.data;
  },

  // Create a new mess schedule
  createMessSchedule: async (scheduleData) => {
    const formattedData = {
      date: scheduleData.date,
      mealType: scheduleData.mealType,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      menu: scheduleData.menu.map(item => ({
        name: item.name,
        category: item.category,
        cost: item.cost
      }))
    };
    const response = await api.post('/api/mess/schedule', formattedData);
    return response.data;
  },

  // Update a mess schedule
  updateMessSchedule: async (id, scheduleData) => {
    const response = await api.put(`/api/mess/schedule/${id}`, scheduleData);
    return response.data;
  },

  // Delete a mess schedule
  deleteMessSchedule: async (id) => {
    const response = await api.delete(`/api/mess/schedule/${id}`);
    return response.data;
  },

  // Get mess statistics
  getMessStats: async () => {
    const response = await api.get('/api/mess/stats');
    return response.data;
  },

  // Mark attendance for mess
  markMessAttendance: async (scheduleId) => {
    const response = await api.post(`/api/mess/attendance/${scheduleId}`);
    return response.data;
  },

  // Get mess attendance report
  getMessReport: async (startDate, endDate) => {
    const params = { startDate, endDate };
    const response = await api.get('/api/mess/report', { params });
    return response.data;
  }
};

export default messApi;