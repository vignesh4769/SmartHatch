import React, { useState } from 'react';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarDay, FaClock } from 'react-icons/fa';

const MyAttendance = () => {
  const [attendanceRecords] = useState([
    {
      date: '2024-02-19',
      status: 'present',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM'
    },
    {
      date: '2024-02-18',
      status: 'present',
      checkIn: '08:55 AM',
      checkOut: '06:05 PM'
    },
    {
      date: '2024-02-17',
      status: 'half-day',
      checkIn: '09:00 AM',
      checkOut: '02:00 PM'
    },
    {
      date: '2024-02-16',
      status: 'absent',
      checkIn: '-',
      checkOut: '-'
    }
  ]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex">
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
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

          {/* Attendance Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Present Days Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Days</p>
                  <h3 className="text-3xl font-bold text-green-600 mt-1">22</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCalendarCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Absent Days Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Days</p>
                  <h3 className="text-3xl font-bold text-red-600 mt-1">3</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <FaCalendarTimes className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            {/* Half Days Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Half Days</p>
                  <h3 className="text-3xl font-bold text-yellow-600 mt-1">2</h3>
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
                        {record.checkIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkOut}
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