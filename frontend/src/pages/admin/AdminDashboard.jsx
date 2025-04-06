import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import DashboardStats from '../../components/shared/DashboardStats';
import RecentActivity from '../../components/admin/RecentActivity'; // Updated import

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 ml-56">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats title="Total Employees" value={stats.employeeCount} icon="users" />
        <DashboardStats title="Active Runs" value={stats.activeRuns} icon="run" />
        <DashboardStats title="Pending Leaves" value={stats.pendingLeaves} icon="leave" />
        <DashboardStats title="Low Stock Items" value={stats.lowStockItems} icon="inventory" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={stats.recentActivities} />
      </div>
    </div>
  );
};

export default AdminDashboard;