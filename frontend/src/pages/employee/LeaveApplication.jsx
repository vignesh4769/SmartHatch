import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaCalendarPlus, FaHistory, FaExclamationCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LeaveApplication = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('apply');
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    reason: "",
    type: "casual",
  });

  const [leaveHistory] = useState([
    { id: 1, type: "Casual", startDate: "2024-02-01", endDate: "2024-02-02", status: "Approved", reason: "Personal work" },
    { id: 2, type: "Sick", startDate: "2024-01-15", endDate: "2024-01-16", status: "Rejected", reason: "Medical appointment" },
  ]);

  const [leaveBalance] = useState({
    casual: { total: 12, used: 4, remaining: 8 },
    sick: { total: 15, used: 2, remaining: 13 },
    earned: { total: 30, used: 10, remaining: 20 },
  });

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-64 min-h-screen bg-gray-900 text-white p-6 fixed left-0">
        <nav className="space-y-2">
          <div className="px-4 py-2 text-gray-400 text-sm">LEAVE MANAGEMENT</div>
          <div 
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer ${
              activeTab === 'apply' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <FaCalendarPlus />
            <span>Apply Leave</span>
          </div>
          <div 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 rounded-lg flex items-center space-x-3 cursor-pointer ${
              activeTab === 'history' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            <FaHistory />
            <span>Leave History</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Leave Management</h1>

          {/* Leave Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.entries(leaveBalance).map(([type, balance]) => (
              <div key={type} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 capitalize mb-4">{type} Leave</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-2xl font-bold text-blue-600">{balance.remaining}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total: {balance.total}</p>
                    <p className="text-sm text-gray-500">Used: {balance.used}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeTab === 'apply' ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Apply for Leave</h2>
              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="casual">Casual Leave</option>
                      <option value="sick">Sick Leave</option>
                      <option value="earned">Earned Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => setFormData({...formData, startDate: date})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) => setFormData({...formData, endDate: date})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Application
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Leave History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveHistory.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{leave.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;