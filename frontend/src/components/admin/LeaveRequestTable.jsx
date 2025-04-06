import React from 'react';

const LeaveRequestTable = ({ requests, onStatusUpdate, hatcheryName }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {requests.map((request) => (
          <tr key={request._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="text-sm font-medium text-gray-900">
                  {request.employee.name}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {request.type}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {request.reason}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {request.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                onClick={() => onStatusUpdate(request._id, 'approved')}
                className="text-green-600 hover:text-green-900"
                disabled={request.status !== 'pending'}
              >
                Approve
              </button>
              <button
                onClick={() => onStatusUpdate(request._id, 'rejected')}
                className="text-red-600 hover:text-red-900"
                disabled={request.status !== 'pending'}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaveRequestTable;