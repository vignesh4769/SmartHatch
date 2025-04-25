import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";         
import api from "../../api/config";

import DashboardStats from "../../components/shared/DashboardStats";
import RecentActivity from "../../components/admin/RecentActivity";
import Button from "../../components/common/Button";
import AdminNotifications from "../../components/admin/AdminNotifications";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();                          

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    attendanceStats: { present: 0, absent: 0, late: 0, "half-day": 0, "on-leave": 0 },
    recentActivities: [],
  });
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.token) throw new Error("Authentication token is missing");

        const res = await api.get("/api/admin/dashboard-stats");
        if (!res?.data?.data) throw new Error("Invalid response format");

        setStats(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.error || err.message;
        console.error("Dashboard error:", msg);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout("/login?message=Session%20expired%20please%20login%20again");
        } else {
          setError(`Failed to load dashboard data: ${msg}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "admin" && user?.token) fetchDashboardData();
    else {
      setLoading(false);
      setError("Authentication required. Please log in.");
    }
  }, [user, logout]);


  if (!user) return null;                      
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error)   return <div className="text-red-500 text-center p-6">{error}</div>;

 
  return (
    <div className={`p-6 ml-56 min-h-screen transition-colors
                     ${darkMode ? "bg-gray-900 text-gray-100"
                                : "bg-gray-50  text-gray-900"}`}>

    
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Admin Dashboard&nbsp;–&nbsp;{user.name || "N/A"}
        </h1>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats title="Total Employees" value={stats.totalEmployees}          icon="users"      />
        <DashboardStats title="Present Today"   value={stats.attendanceStats.present} icon="attendance" />
        <DashboardStats title="Pending Leaves"  value={stats.pendingLeaves}           icon="leave"      />
        <DashboardStats title="Absent Today"    value={stats.attendanceStats.absent}  icon="users"      />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-6`}>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <Button
              text="Register Employee"
              className="btn btn-primary"
              onClick={() => navigate("/admin/employees/new")}
            />
            <Button
              text="Mark Attendance"
              className="btn btn-primary"
              onClick={() => navigate("/admin/attendance")}
            />
          </div>
        </div>

        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-6`}>
          <RecentActivity activities={stats.recentActivities} />
        </div>

        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow p-6 col-span-1 md:col-span-2 mt-6`}>
          <AdminNotifications type="inventory" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
