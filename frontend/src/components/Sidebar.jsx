import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`fixed h-screen bg-base-100 p-5 shadow-lg transition-all duration-500 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"}`}>
      <ul className="menu space-y-2">
        <li><Link to="/admin-dashboard">Dashboard</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
        <li><Link to="/mess-management">Mess Management</Link></li>
        <li><Link to="/cost-management">Cost Management</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
