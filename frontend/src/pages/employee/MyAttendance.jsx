import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarDay, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getEmployeeAttendance } from '../../api/attendanceApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyAttendance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchAttendanceRecords();
    // eslint-disable-next-line
  }, [selectedMonth]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeAttendance(selectedMonth);
      setAttendanceRecords(response.data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center ml-64">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 mx-10 my-16 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
          <FaCalendarDay className="mr-2" />
          My Attendance
        </h2>
        <div className="mb-6 flex flex-col items-center w-full">
          <label className="mb-2 font-medium">Select Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2 w-48 text-center"
          />
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : attendanceRecords.length === 0 ? (
          <div className="text-gray-500 py-12 text-lg">No attendance records found for this month.</div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {attendanceRecords.map(record => (
              <div key={record._id} className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center border border-gray-200">
                <div className="text-lg font-semibold mb-2">{formatDate(record.date)}</div>
                <div className="mb-2">
                  {record.status === 'present'     && <span className="text-green-600 font-bold">Present</span>}
                  {record.status === 'absent'      && <span className="text-red-600 font-bold">Absent</span>}
                  {record.status === 'late'        && <span className="text-yellow-600 font-bold">Late</span>}
                  {record.status === 'half-day'    && <span className="text-blue-600 font-bold">Half Day</span>}
                  {record.status === 'on-leave'    && <span className="text-purple-600 font-bold">On Leave</span>}
                  {record.status === 'not-marked'  && <span className="text-gray-600 font-bold">Not Marked</span>}
                </div>
                <div className="text-gray-700">Check In: {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;
