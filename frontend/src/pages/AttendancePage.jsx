import React from "react";
import Sidebar from "../components/Sidebar";
import EmployeeAttendanceTable from "../components/EmployeeAttendanceTable";

const AttendancePage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="p-6 bg-gray-100 ml-64 transition-all duration-300 w-full">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-5">
          <h2 className="text-2xl font-bold">Employee Attendance</h2>
        </header>

        <EmployeeAttendanceTable />
      </main>
    </div>
  );
};

export default AttendancePage;
