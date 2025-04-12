import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import LeaveRequestTable from "../../components/admin/LeaveRequestTable";

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        const response = await axios.get("/api/admin/leaves/pending");
        setLeaveRequests(response.data);
      } catch (err) {
        setError("Failed to fetch leave requests");
        console.error("Error fetching leave requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLeaves();
  }, []);

  const handleStatusUpdate = async (id, status, comments = "") => {
    try {
      await axios.put(`/api/admin/leaves/${id}`, { status, comments });
      setLeaveRequests(
        leaveRequests.map((request) =>
          request._id === id ? { ...request, status, comments } : request
        )
      );
    } catch (err) {
      setError("Failed to update leave status");
      console.error("Error updating leave status:", err);
    }
  };

  if (loading) return <div>Loading leave requests...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave Approval</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <LeaveRequestTable
          requests={leaveRequests}
          onStatusUpdate={handleStatusUpdate}
          hatcheryName={user.hatcheryName}
        />
      </div>
    </div>
  );
};

export default LeaveApproval; // This is the crucial default export
