import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ userRole, handleLogout }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

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
    <div className="bg-gray-800 text-white shadow-sm h-16 z-50 flex items-center justify-between px-6 fixed top-0 left-0 w-full shadow-md p-4">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/images/logo.jpg" className="w-10 h-10 rounded-full mr-3" alt="SmartHatch Logo" />
        <span className="text-xl font-bold">SmartHatch</span>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex">
        <ul className="menu menu-horizontal space-x-4">
          {/* Links for all roles */}
          <li><Link to="/dashboard">📊 Dashboard</Link></li>
          
          {/* Admin specific links */}
          {userRole === "admin" && (
            <>
              <li><Link to="/employees">👷 Employees</Link></li>
              <li><Link to="/visitor">🚶 Visitors</Link></li>
              <li><Link to="/inventory-management">📦 Inventory</Link></li>
              <li><Link to="/financial">💰 Financial</Link></li>
            </>
          )}

          {/* Employee specific links */}
          {userRole === "employee" && (
            <li><Link to="/leave-request">📪 Leave</Link></li>
          )}
        </ul>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button className="text-lg p-2 hover:bg-gray-700 rounded-full focus:outline-none" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            🔔
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-3 z-10 text-gray-800">
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
            <div className="w-8 h-8">
              <img
                src={userRole === "admin" ? "/images/admin.jpg" : "/images/employee.jpg"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover" // Ensure the image is circular and covers the area
              />
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-3 z-10 text-gray-800">
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
