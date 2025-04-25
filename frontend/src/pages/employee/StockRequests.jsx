import React, { useState, useEffect } from "react";
import { FaBox, FaPlus, FaHistory, FaExclamationCircle, FaBell } from "react-icons/fa";
import api from "../../api/config";

const StockRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: 1,
    urgency: "medium", // default to allowed value
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/employee/inventory/stock-requests");
        setRequests(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        items: [
          {
            name: formData.itemName,
            quantity: Number(formData.quantity)
          }
        ],
        urgency: formData.urgency,
        notes: formData.notes
      };
      await api.post("/api/employee/inventory/stock-requests", payload);
      // Refetch requests after successful submission
      const res = await api.get("/api/employee/inventory/stock-requests");
      setRequests(res.data.data || []);
      setShowForm(false);
      setFormData({ itemName: "", quantity: 1, urgency: "medium", notes: "" });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
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
                <div>
                  <label className="block text-gray-700 mb-1">Item Name / ID</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter item name or ID"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Urgency</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    disabled={submitting}
                  >
                    <FaBell className="text-sm" />
                    {submitting ? "Submitting..." : "Submit & Notify"}
                  </button>
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
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
              {loading ? (
                <div className="p-4">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-500">{error}</div>
              ) : (
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
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {request.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockRequests;