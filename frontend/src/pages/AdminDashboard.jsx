import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import Charts from "../components/Charts";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <main className={`p-6 bg-gray-100 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20 w-full"}`}>
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
