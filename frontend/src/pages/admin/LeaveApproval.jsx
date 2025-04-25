import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiCalendar, FiClock, FiUser, FiFilter } from 'react-icons/fi';
import { LeaveApi } from '../../api/leaveApi';
import { toast } from 'react-toastify';

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // {id, status}
  const [note, setNote] = useState('');

  const openNoteModal = (id, status) => {
    setModalAction({ id, status: status.toLowerCase() });
    setNote('');
    setShowNoteModal(true);
  };
  const closeNoteModal = () => {
    setShowNoteModal(false);
    setModalAction(null);
    setNote('');
  };
  const submitNote = () => {
    if (modalAction) {
      handleStatusUpdate(modalAction.id, modalAction.status, note);
      closeNoteModal();
    }
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const response = await LeaveApi.getAllLeaves();
        setLeaves(response.data.data || response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch leaves');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status, adminNotes = '') => {
    try {
      const lowerStatus = status.toLowerCase();
      await LeaveApi.updateLeaveStatus(id, { status: lowerStatus, adminNotes });
      toast.success(`Leave ${lowerStatus} successfully`);
      setLeaves(leaves.map(leave =>
        leave._id === id ? { ...leave, status: lowerStatus, adminNotes } : leave
      ));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update leave status');
    }
  };

  const filteredRequests = leaves.filter(request => {
    if (filter === 'all') return true;
    return request.status.toLowerCase() === filter;
  });

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
        <p className="text-gray-600 mt-2">Review and manage employee leave requests</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <h3 className="text-2xl font-bold text-gray-800">{leaves.length}</h3>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-600">
                {leaves.filter(r => r.status.toLowerCase() === 'pending').length}
              </h3>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <h3 className="text-2xl font-bold text-green-600">
                {leaves.filter(r => r.status.toLowerCase() === 'approved').length}
              </h3>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <h3 className="text-2xl font-bold text-red-600">
                {leaves.filter(r => r.status.toLowerCase() === 'rejected').length}
              </h3>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiFilter className="text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold">Leave Requests</h2>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.employee.firstName} {request.employee.lastName}</div>
                        <div className="text-sm text-gray-500">{request.employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.startDate ? new Date(request.startDate).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.endDate ? new Date(request.endDate).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.adminNotes || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status.toLowerCase() === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openNoteModal(request._id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openNoteModal(request._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for admin notes */}
      {showNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">Admin Notes</h3>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mb-4"
              rows={3}
              placeholder="Enter notes (optional)"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={closeNoteModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={submitNote} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveManagement;