import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../components/DashboardStats";
import Charts from "../components/Charts";
import { useAuth } from "../context/authContext";

const AdminDashboard = () => {
  const [currentRun, setCurrentRun] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth(); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/login"); 
    }

    const lastRun = localStorage.getItem("currentRun") || "No Active Run";
    setCurrentRun(lastRun);
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-grow p-6 bg-gray-100 ml-48">
        <header className="bg-white p-4 rounded-lg shadow mb-5 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <span className="text-lg font-semibold bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
            {currentRun}
          </span>
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
