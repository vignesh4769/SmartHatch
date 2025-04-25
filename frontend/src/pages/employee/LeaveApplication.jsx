import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaCalendarPlus, FaHistory, FaExclamationCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LeaveApi } from '../../api/leaveApi';
import { toast } from 'react-toastify';

const LeaveApplication = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('apply');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: "",
    type: "casual",
  });

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [leaveBalance, setLeaveBalance] = useState({
    casual: { total: 0, used: 0, remaining: 0 },
    sick: { total: 0, used: 0, remaining: 0 },
    earned: { total: 0, used: 0, remaining: 0 },
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await LeaveApi.getMyLeaves();
        const history = response.data.data || [];
        setLeaveHistory(history);
        // Calculate leave balance dynamically
        const leavePolicy = { casual: 12, sick: 8, earned: 10 }; // adjust as per your org
        const balance = { casual: { total: 12, used: 0, remaining: 12 }, sick: { total: 8, used: 0, remaining: 8 }, earned: { total: 10, used: 0, remaining: 10 } };
        history.forEach(leave => {
          if (leave.status === 'approved' && balance[leave.type]) {
            // Calculate number of days for this leave
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
            balance[leave.type].used += days > 0 ? days : 1;
          }
        });
        for (const type in balance) {
          balance[type].remaining = balance[type].total - balance[type].used;
        }
        setLeaveBalance(balance);
      } catch (err) {
        setHistoryError(err.response?.data?.message || "Failed to fetch leave history");
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LeaveApi.applyLeave({
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });
      toast.success('Leave application submitted successfully');
      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        reason: '',
        type: 'casual'
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit leave application');
    }
  };

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-64 min-h-screen bg-gray-900 text-white p-6 fixed left-0 top-0 h-full z-30">
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
      <div className="flex-1 p-8 bg-gray-100 min-h-screen" style={{ marginLeft: 272 }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Leave Management</h1>

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
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Apply for Leave</h2>
              <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6 max-w-4xl mx-auto w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 text-center">Leave History</h2>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveHistory.map((leave) => (
                      <tr key={leave._id || `${leave.type}-${leave.startDate}-${leave.endDate}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(leave.status || '').charAt(0).toUpperCase() + (leave.status || '').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{leave.reason}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{leave.adminNotes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {loadingHistory && (
                <div className="text-center py-4">
                  <FaExclamationCircle className="text-gray-500 text-lg" />
                  <p className="text-gray-500 text-sm">Loading leave history...</p>
                </div>
              )}
              {historyError && (
                <div className="text-center py-4">
                  <FaExclamationCircle className="text-red-500 text-lg" />
                  <p className="text-red-500 text-sm">{historyError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;