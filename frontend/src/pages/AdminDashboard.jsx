import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import Charts from "../components/Charts";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <main className="flex-grow p-6 bg-gray-100 ml-64">
        <header className="bg-white p-4 rounded-lg shadow mb-5">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </header>
        <DashboardStats />
        <div className="mt-6">
          <Charts />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
