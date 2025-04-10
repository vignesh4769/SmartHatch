import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import AttendanceTable from '../../components/admin/AttendanceTable';

const AttendanceManagement = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('/api/admin/attendance');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleUpdateAttendance = async (id, status) => {
    try {
      await axios.put(`/api/admin/attendance/${id}`, { status });
      setAttendanceData(attendanceData.map(item => 
        item._id === id ? { ...item, status } : item
      ));
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  if (loading) return <div>Loading attendance data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <AttendanceTable 
          data={attendanceData} 
          onUpdate={handleUpdateAttendance} 
          hatcheryName={user.hatcheryName}
        />
      </div>
    </div>
  );
};

export default AttendanceManagement; // Must have default export