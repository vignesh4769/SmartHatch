import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed h-screen w-64 bg-base-100 p-5 shadow-lg">
      <ul className="menu space-y-2">
        <li><Link to="/admin-dashboard">📊 Dashboard</Link></li>
        <li><Link to="/attendance">📅 Attendance</Link></li>
        <li><Link to="/mess-management">🍽️ Mess Management</Link></li>
        <li><Link to="/cost-management">💰 Cost Management</Link></li>
        <li><Link to="/reports">📑 Reports</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
