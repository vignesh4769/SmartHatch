import React from "react";
import { Link } from "react-router-dom";

const SidebarEmployee = () => {
  return (
    <aside className="w-64 h-screen bg-base-200 p-5 fixed">
      <div className="flex items-center mb-5">
        <img src="/src/assets/images/employee-avatar.jpg" className="w-12 h-12 rounded-full" alt="Employee" />
        <h2 className="ml-3 text-xl font-bold">Employee</h2>
      </div>
      <ul className="menu space-y-2">
        <li><Link to="/employee/dashboard" className="active">Dashboard</Link></li>
        <li><Link to="/employee/attendance">Attendance</Link></li>
        <li><Link to="/employee/leave-request">Request Leave</Link></li>
        <li><Link to="/employee/mess">Mess Schedule</Link></li>
      </ul>
    </aside>
  );
};

export default SidebarEmployee;
