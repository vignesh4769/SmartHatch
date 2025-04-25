import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import LeaveApplication from "./LeaveApplication";
import LeaveApi from "../../api/leaveApi";

const MyLeaves = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await LeaveApi.getMyLeaves();
        setLeaves(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch leaves");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleNewLeaveClick = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    navigate(0);
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto ml-56">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Leave Applications</h1>
        <button
          onClick={handleNewLeaveClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Application
        </button>
      </div>

      {showApplicationForm && (
        <div className="mb-8">
          <LeaveApplication onSuccess={handleApplicationSuccess} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No leave applications found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {leave.startDate ? format(new Date(leave.startDate), "yyyy-MM-dd") : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {leave.endDate ? format(new Date(leave.endDate), "yyyy-MM-dd") : ""}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${getStatusColor(leave.status)}`}>
                    {(leave.status || '').charAt(0).toUpperCase() + (leave.status || '').slice(1)}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                    {leave.adminNotes || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeaves;
