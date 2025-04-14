import { useState, useEffect } from 'react';
import { FiUserCheck, FiUserX, FiClock, FiCalendar, FiFilter } from 'react-icons/fi';

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      employeeName: 'John Doe',
      date: '2024-02-15',
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      status: 'Present',
      department: 'Operations'
    },
    // Add more sample records as needed
  ]);

  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  });

  useEffect(() => {
    // Calculate statistics
    const present = attendanceRecords.filter(record => record.status === 'Present').length;
    const absent = attendanceRecords.filter(record => record.status === 'Absent').length;
    const late = attendanceRecords.filter(record => record.status === 'Late').length;
    
    setStats({
      present,
      absent,
      late,
      total: attendanceRecords.length
    });
  }, [attendanceRecords]);

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor employee attendance and statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Employees</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FiUserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Present Today</p>
              <h3 className="text-2xl font-bold text-green-600">{stats.present}</h3>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FiUserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Absent Today</p>
              <h3 className="text-2xl font-bold text-red-600">{stats.absent}</h3>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <FiUserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Late Arrivals</p>
              <h3 className="text-2xl font-bold text-yellow-600">{stats.late}</h3>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiFilter className="text-gray-400 mr-2" />
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {record.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'Present' ? 'bg-green-100 text-green-800' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;