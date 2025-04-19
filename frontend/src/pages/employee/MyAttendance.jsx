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

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const response = await getEmployeeAttendance(user._id, startDate.toISOString(), new Date().toISOString());
      setAttendanceRecords(response.data || []);
      
      // Check if attendance is already marked for today
      const today = new Date().toISOString().split('T')[0];
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
        date: new Date().toISOString(),
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Attendance</h1>
              <p className="text-gray-600 mt-1">Track your attendance and performance</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <FaClock className="text-blue-600" />
              <span className="text-gray-700 font-medium">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Mark Attendance Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mark Today's Attendance</h2>
            {todayStatus ? (
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-lg ${
                  todayStatus === 'present' ? 'bg-green-100 text-green-800' :
                  todayStatus === 'absent' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {todayStatus.charAt(0).toUpperCase() + todayStatus.slice(1)}
                </span>
                <p className="text-gray-600">Attendance already marked for today</p>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => handleMarkAttendance('present')}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  <FaCalendarCheck /> Present
                </button>
                <button
                  onClick={() => handleMarkAttendance('absent')}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  <FaCalendarTimes /> Absent
                </button>
                <button
                  onClick={() => handleMarkAttendance('half-day')}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                >
                  <FaCalendarDay /> Half Day
                </button>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Days</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-1">
                    {attendanceRecords.filter(r => r.status === 'present').length}
                  </h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCalendarCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Days</p>
                  <h3 className="text-3xl font-bold text-red-600 mt-1">
                    {attendanceRecords.filter(r => r.status === 'absent').length}
                  </h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FaCalendarTimes className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Half Days</p>
                  <h3 className="text-3xl font-bold text-yellow-600 mt-1">
                    {attendanceRecords.filter(r => r.status === 'half-day').length}
                  </h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaCalendarDay className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Record Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Monthly Record</h2>
            </div>
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
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkIn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkOut || '-'}
                      </td>
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