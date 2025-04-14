import React, { useState } from "react";
import { FaBox, FaPlus, FaHistory, FaExclamationCircle, FaBell } from "react-icons/fa";

const StockRequests = () => {
  const [requests] = useState([
    {
      _id: '1',
      itemName: 'Printer Paper A4',
      quantity: 5,
      urgency: 'normal',
      status: 'pending',
      createdAt: new Date(),
      notes: 'Need for office printing'
    },
    {
      _id: '2',
      itemName: 'Ink Cartridges',
      quantity: 2,
      urgency: 'high',
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000),
      notes: 'Printer running low on ink'
    },
    {
      _id: '3',
      itemName: 'Staplers',
      quantity: 3,
      urgency: 'low',
      status: 'rejected',
      createdAt: new Date(Date.now() - 172800000),
      notes: 'For document binding'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    urgency: "normal",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add notification logic here
    console.log("New request submitted:", formData);
    setShowForm(false);
  };

  return (
    <div className="flex">
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Stock Requests</h1>
              <p className="text-gray-600 mt-1">Request and track inventory items</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="text-sm" />
                New Request
              </button>
            </div>
          </div>

          {/* Request Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">New Stock Request</h2>
                <FaBox className="text-2xl text-blue-600" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... existing form fields ... */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaBell className="text-sm" />
                    Submit & Notify
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Request History */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Request History</h2>
                <p className="text-sm text-gray-500 mt-1">Track your stock requests</p>
              </div>
              <FaHistory className="text-2xl text-blue-600" />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.itemName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                          request.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {request.notes}
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

export default StockRequests;