import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import EmployeeAttendanceTable from "../components/EmployeeAttendanceTable";

const AttendancePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component with Toggle Support */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content Adjusts Based on Sidebar State */}
      <main className={`p-6 bg-gray-100 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20 w-full"}`}>
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-5">
          <h2 className="text-2xl font-bold">Employee Attendance</h2>
          
          {/* Toggle Sidebar Button */}
          <button onClick={toggleSidebar} className="btn btn-primary">
            {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          </button>
        </header>

        <EmployeeAttendanceTable />
      </main>
    </div>
  );
};

export default AttendancePage;
