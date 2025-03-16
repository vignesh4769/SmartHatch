import React from "react";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-base-200 p-5 fixed">
      <div className="flex items-center mb-5">
        <img src="/images/logo.jpg" className="w-12 h-12 rounded-full" alt="Logo" />
        <h2 className="ml-3 text-xl font-bold">SmartHatch</h2>
      </div>
      <ul className="menu space-y-2">
        <li><a className="active">Dashboard</a></li>
        <li><a>Attendance</a></li>
        <li><a>Mess Management</a></li>
        <li><a>Cost Management</a></li>
        <li><a>Reports</a></li>
        <li><a>Settings</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
