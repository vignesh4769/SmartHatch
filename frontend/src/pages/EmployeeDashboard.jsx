import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarEmployee from "../components/SidebarEmployee";
import AttendanceCard from "../components/AttendanceCard";
import LeaveRequestForm from "../components/LeaveRequestForm";
import MessSchedule from "../components/MessSchedule";
import { useAuth } from "../context/authContext";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from auth context

  useEffect(() => {
    // Check if user is authenticated and an employee
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "employee") {
      navigate("/login"); // Redirect unauthorized users
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <SidebarEmployee />
      <main className="flex-1 p-6 bg-gray-100 ml-64">
        <header className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Employee Dashboard</h2>
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search..." className="input input-bordered w-64" />
            <button className="btn btn-circle btn-outline">
              <span>🔔</span>
            </button>
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src="/assets/images/employee-avatar.jpg" alt="Employee" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6">
          <AttendanceCard />
          <MessSchedule />
        </div>

        <div className="mt-6">
          <LeaveRequestForm />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
