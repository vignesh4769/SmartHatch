import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarDay, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { markAttendance, getEmployeeAttendance } from '../../api/attendanceApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [todayStatus, setTodayStatus] = useState(null);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [filterDate]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const startDate = new Date(filterDate);
      startDate.setMonth(startDate.getMonth() - 1);
      const response = await getEmployeeAttendance(user._id, startDate.toISOString(), new Date(filterDate).toISOString());
      setAttendanceRecords(response.data || []);
      // Check if attendance is already marked for the filter date
      const today = filterDate;
      const todayRecord = response.data.find(record => record.date.split('T')[0] === today);
      setTodayStatus(todayRecord?.status || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (status) => {
    try {
      setSubmitting(true);
      await markAttendance({
        employeeId: user._id,
        date: filterDate,
        status
      });
      toast.success('Attendance marked successfully');
      setTodayStatus(status);
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Statistics
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const halfDayCount = attendanceRecords.filter(r => r.status === 'half-day').length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
            <p className="text-gray-600 mt-2">Track your attendance and statistics</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Present Days</p>
                  <h3 className="text-2xl font-bold text-green-600">{presentCount}</h3>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <FaCalendarCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Absent Days</p>
                  <h3 className="text-2xl font-bold text-red-600">{absentCount}</h3>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <FaCalendarTimes className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Half Days</p>
                  <h3 className="text-2xl font-bold text-yellow-600">{halfDayCount}</h3>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <FaCalendarDay className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Attendance */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaClock className="text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold">Attendance Records</h2>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* Mark Attendance Section REMOVED */}
            {/* Monthly Record Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          record.status === 'present' ? 'bg-green-100 text-green-800' :
                          record.status === 'absent' ? 'bg-red-100 text-red-800' :
                          record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn || '--:--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut || '--:--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;