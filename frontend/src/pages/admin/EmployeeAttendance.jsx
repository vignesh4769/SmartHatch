import { useState, useEffect } from 'react';
import { FiUserCheck, FiUserX, FiClock, FiCalendar, FiSun, FiMoon } from 'react-icons/fi';
import api from '../../api/employeeAPI';

function EmployeeAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to track dark mode

  useEffect(() => {
    // Fetch employees from the same department as admin
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAttendanceChange = (employeeId, status) => {
    setAttendance(prev => ({
      ...prev,
      [employeeId]: status
    }));
  };

  const submitAttendance = async () => {
    try {
      await api.post('/attendance', {
        date,
        records: Object.entries(attendance).map(([employeeId, status]) => ({
          employeeId,
          status
        }))
      });
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`ml-64 p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen transition-colors`}>
      {/* Dark Mode Toggle Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>

      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Employee Attendance</h1>
        <p className={`text-${isDarkMode ? 'gray-400' : 'gray-600'} mt-2`}>Mark attendance for employees</p>
      </div>

      {/* Attendance Date Section */}
      <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiCalendar className={`text-${isDarkMode ? 'yellow-400' : 'blue-600'} text-xl mr-2`} />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Attendance Date</h2>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${isDarkMode ? 'yellow' : 'blue'}-500`}
          />
        </div>

        {/* Employee Attendance Table */}
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y divide-gray-200 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <thead className={`bg-${isDarkMode ? 'gray-700' : 'gray-50'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className={`bg-${isDarkMode ? 'gray-800' : 'white'} divide-y divide-gray-200`}>
              {employees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{employee.name}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(employee._id, 'Present')}
                        className={`px-3 py-1 rounded-lg flex items-center ${attendance[employee._id] === 'Present' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FiUserCheck className="mr-1" /> Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(employee._id, 'Absent')}
                        className={`px-3 py-1 rounded-lg flex items-center ${attendance[employee._id] === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FiUserX className="mr-1" /> Absent
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(employee._id, 'Half Day')}
                        className={`px-3 py-1 rounded-lg flex items-center ${attendance[employee._id] === 'Half Day' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <FiClock className="mr-1" /> Half Day
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Attendance Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={submitAttendance}
            className={`bg-${isDarkMode ? 'yellow' : 'blue'}-600 text-white px-6 py-2 rounded-lg hover:bg-${isDarkMode ? 'yellow' : 'blue'}-700 transition-colors`}
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAttendance;
