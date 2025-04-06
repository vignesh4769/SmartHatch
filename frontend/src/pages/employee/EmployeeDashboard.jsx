import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import LeaveRequestForm from './LeaveRequestForm';
import InventoryRequestForm from './InventoryRequestForm';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/employees/dashboard/my');
        setDashboardData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLeaveSubmit = async (leaveData) => {
    try {
      await api.post('/api/leaves', leaveData);
      // Refresh dashboard data
      const response = await api.get('/api/employees/dashboard/my');
      setDashboardData(response.data.data);
      setShowLeaveForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
    }
  };

  const handleInventorySubmit = async (inventoryData) => {
    try {
      await api.post('/api/inventory/requests', inventoryData);
      // Refresh dashboard data
      const response = await api.get('/api/employees/dashboard/my');
      setDashboardData(response.data.data);
      setShowInventoryForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit inventory request');
    }
  };

  if (loading) return <div className="text-center py-8">Loading dashboard...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!dashboardData) return <div className="text-center py-8">No data available</div>;

  const { employee, attendanceStats, leaveRequests, salaries, notifications, messMenu, inventoryAlerts } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h2>
                <p className="text-gray-500">{employee.position}</p>
                <p className="text-sm text-gray-400">ID: {employee.employeeId}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Department</h3>
                <p>{employee.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Joining Date</h3>
                <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  employee.status === 'active' ? 'bg-green-100 text-green-800' :
                  employee.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('leaves')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'leaves'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Leaves
                </button>
                <button
                  onClick={() => setActiveTab('salary')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'salary'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Salary
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'notifications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Notifications
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                  
                  {/* Attendance Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800">Attendance</h3>
                      <p className="text-2xl font-bold">{attendanceStats.present} days</p>
                      <p className="text-sm text-blue-600">{attendanceStats.percentage}% present</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800">Current Salary</h3>
                      <p className="text-2xl font-bold">₹{employee.salary.toLocaleString()}</p>
                      <p className="text-sm text-green-600">Monthly</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-800">Pending Leaves</h3>
                      <p className="text-2xl font-bold">
                        {leaveRequests.filter(l => l.status === 'pending').length}
                      </p>
                      <p className="text-sm text-purple-600">Requests</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setShowLeaveForm(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Apply for Leave
                      </button>
                      <button
                        onClick={() => setShowInventoryForm(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Request Inventory
                      </button>
                      <Link
                        to="/runs"
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                      >
                        View Current Runs
                      </Link>
                    </div>
                  </div>

                  {/* Mess Menu */}
                  {messMenu && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Today's Mess Menu</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700">Breakfast</h4>
                            <p>{messMenu.breakfast || 'Not specified'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">Lunch</h4>
                            <p>{messMenu.lunch || 'Not specified'}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">Dinner</h4>
                            <p>{messMenu.dinner || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inventory Alerts */}
                  {inventoryAlerts && inventoryAlerts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Inventory Alerts</h3>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-700 font-medium mb-2">Low stock items:</p>
                        <ul className="list-disc pl-5">
                          {inventoryAlerts.map(item => (
                            <li key={item._id}>
                              {item.name} ({item.quantity} {item.unit} remaining)
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'leaves' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Leave History</h2>
                    <button
                      onClick={() => setShowLeaveForm(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Apply for Leave
                    </button>
                  </div>
                  
                  {leaveRequests.length === 0 ? (
                    <p className="text-gray-500">No leave requests found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dates
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {leaveRequests.map(leave => (
                            <tr key={leave._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                              </td>
                              <td className="px-6 py-4">
                                {leave.reason}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'salary' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Salary History</h2>
                  
                  {salaries.length === 0 ? (
                    <p className="text-gray-500">No salary records found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Month/Year
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Basic Salary
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bonus
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Deductions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Net Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {salaries.map(salary => (
                            <tr key={salary._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {salary.month}/{salary.year}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                ₹{salary.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                ₹{salary.bonus.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                ₹{salary.deductions.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                ₹{(salary.amount + salary.bonus - salary.deductions).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {new Date(salary.paymentDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                  
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications found</p>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map(notification => (
                        <div 
                          key={notification._id} 
                          className={`p-4 border rounded-lg ${
                            notification.isRead 
                              ? 'bg-white border-gray-200' 
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{notification.title}</h3>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Apply for Leave</h3>
              <button 
                onClick={() => setShowLeaveForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <LeaveRequestForm 
              onSubmit={handleLeaveSubmit}
              onCancel={() => setShowLeaveForm(false)}
            />
          </div>
        </div>
      )}

      {/* Inventory Request Modal */}
      {showInventoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Request Inventory</h3>
              <button 
                onClick={() => setShowInventoryForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <InventoryRequestForm 
              onSubmit={handleInventorySubmit}
              onCancel={() => setShowInventoryForm(false)}
              inventoryItems={inventoryAlerts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;