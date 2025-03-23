import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ userRole, handleLogout, toggleSidebar }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-base-100 shadow-sm h-14 z-50 flex items-center justify-between px-4 fixed top-0 left-0 w-full bg-white shadow-md p-4 z-50">
      {/* Logo & Sidebar Toggle */}
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-xl font-bold flex items-center focus:outline-none">
          <img src="/images/logo.jpg" className="w-10 h-10 rounded-full mr-2" alt="SmartHatch Logo" />
          SmartHatch
        </button>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex">
        <ul className="menu menu-horizontal space-x-4">
          {userRole === "admin" ? (
            <>
              <li><Link to="/admin-dashboard">📊 Dashboard</Link></li>
              <li><Link to="/employees">👷 Employees</Link></li>
              <li><Link to="/visitors">🚶 Visitors</Link></li>
              <li><Link to="/mess">🍽️ Mess</Link></li>
              <li><Link to="/inventory">📦 Inventory</Link></li>
              <li><Link to="/financial">💰 Financial</Link></li>
            </>
          ) : userRole === "employee" ? (
            <>
              <li><Link to="/employee-dashboard">📊 Dashboard</Link></li>
              <li><Link to="/attendance">🗓️ Attendance</Link></li>
              <li><Link to="/leave-request">📪 Leave</Link></li>
              <li><Link to="/mess">🍽️ Mess</Link></li>
            </>
          ) : (
            <li className="text-gray-500">Invalid Role</li>
          )}
        </ul>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button className="text-lg p-1" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            🔔
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3">
              <h3 className="font-bold">Notifications</h3>
              <ul className="mt-2 space-y-2">
                <li className="p-2 bg-gray-100 rounded">New leave request pending approval</li>
                <li className="p-2 bg-gray-100 rounded">Low inventory alert</li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button className="avatar" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="w-8 h-8 ring-primary ring-offset-2">
              <img src={userRole === "admin" ? "/images/admin.jpg" : "/images/employee.jpg"} alt="Profile" />
            </div>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-3">
              <ul className="space-y-2">
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">View Profile</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Edit Profile</li>
                <li className="p-2 hover:bg-red-100 rounded cursor-pointer text-red-600" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
