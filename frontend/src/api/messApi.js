import api from './config';

const messApi = {
  // Get mess schedules for a date range
  getMessSchedules: async (startDate, endDate) => {
    try {
      const params = {
        startDate,
        endDate
      };
      
      const response = await api.get('/api/mess/schedule', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching mess schedules:', error.response?.data);
      throw error.response?.data || { error: 'Failed to fetch mess schedules' };
    }
  },

  // Create a new mess schedule
  createMessSchedule: async (scheduleData) => {
    console.log('Creating mess schedule with data:', scheduleData);
    
    // Ensure menu is an array of objects with required properties
    const formattedMenu = Array.isArray(scheduleData.menu) 
      ? scheduleData.menu.map(item => ({
          name: item.name || '',
          category: item.category || scheduleData.mealType,
          cost: item.cost || 0
        }))
      : [];
    
    const formattedData = {
      date: scheduleData.date,
      mealType: scheduleData.mealType,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      menu: formattedMenu
    };
    
    console.log('Formatted data for API:', formattedData);
    
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