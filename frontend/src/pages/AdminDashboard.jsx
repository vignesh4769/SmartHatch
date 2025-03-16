import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardStats from "../components/DashboardStats";
import Charts from "../components/Charts";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 ml-64">
        <header className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search..." className="input input-bordered w-64" />
            <button className="btn btn-circle btn-outline">
              <span>🔔</span>
            </button>
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src="/images/admin.jpg" alt="Admin" />
              </div>
            </div>
          </div>
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
