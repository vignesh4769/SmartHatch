import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-54 h-screen bg-gray-800 text-white p-4 fixed">
      <ul className="menu space-y-2">
        <li><Link to="/admin-dashboard">📊 Dashboard</Link></li>
        <br/>
        <li><Link to="/attendance">📅 Attendance</Link></li>
        <li><Link to="/mess-management">🍽️ Mess Management</Link></li>
        <li><Link to="/cost-management">💰 Cost Management</Link></li>
        <li><Link to="/run-management">📈 Run Management</Link></li> 
        <li><Link to="/reports">📑 Reports</Link></li>
        <li><Link to="/settings">⚙️ Settings</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
