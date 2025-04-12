import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/dashboard';
import { FiUsers, FiUserCheck, FiUserX, FiUserMinus, FiActivity } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const RecentEmployeesList = ({ employees }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-semibold mb-4">Recent Employees</h3>
    <div className="space-y-4">
      {employees.map((employee) => (
        <div key={employee._id} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">{employee.user.name}</p>
            <p className="text-sm text-gray-500">{employee.user.email}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardStats = () => {
  const { data, isLoading, error } = useQuery(['dashboardData'], getDashboardData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error loading dashboard data
      </div>
    );
  }

  const stats = data?.data || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.employeeCount}
          icon={FiUsers}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={FiUserCheck}
          color="bg-green-500"
        />
        <StatCard
          title="Inactive Employees"
          value={stats.inactiveEmployees}
          icon={FiUserX}
          color="bg-yellow-500"
        />
        <StatCard
          title="Suspended Employees"
          value={stats.suspendedEmployees}
          icon={FiUserMinus}
          color="bg-red-500"
        />
        <StatCard
          title="Active Runs"
          value={stats.activeRuns}
          icon={FiActivity}
          color="bg-purple-500"
        />
      </div>

      {stats.recentEmployees && stats.recentEmployees.length > 0 && (
        <RecentEmployeesList employees={stats.recentEmployees} />
      )}
    </div>
  );
};

export default DashboardStats;