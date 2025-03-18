import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ userRole, handleLogout, toggleSidebar }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // Close dropdowns when clicking outside
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
    <div className="navbar bg-base-100 shadow-sm p-4 fixed top-0 w-full z-50">
      {/* ✅ Clickable Logo to Toggle Sidebar */}
      <div className="navbar-start">
        <button onClick={toggleSidebar} className="text-xl font-bold flex items-center focus:outline-none">
          <img src="/images/logo.jpg" className="w-10 h-10 rounded-full mr-2" alt="SmartHatch Logo" />
          SmartHatch
        </button>
      </div>

      {/* ✅ Navigation Links - Correctly Display Based on userRole */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {userRole === "admin" ? (
            <>
              <li><Link to="/admin-dashboard">Dashboard</Link></li>
              <li><Link to="/employees">Employees</Link></li>
              <li><Link to="/visitors">Visitors</Link></li>
              <li><Link to="/mess">Mess</Link></li>
              <li><Link to="/inventory">Inventory</Link></li>
              <li><Link to="/financial">Financial</Link></li>
            </>
          ) : userRole === "employee" ? (
            <>
              <li><Link to="/employee-dashboard">Dashboard</Link></li>
              <li><Link to="/attendance">Attendance</Link></li>
              <li><Link to="/leave-request">Leave</Link></li>
              <li><Link to="/mess">Mess</Link></li>
            </>
          ) : (
            <li className="text-gray-500">Invalid Role</li> // Handles unexpected roles
          )}
        </ul>
      </div>

      {/* Notifications & Profile */}
      <div className="navbar-end flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            className="btn btn-circle btn-outline"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            🔔
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
              <h3 className="font-bold">Notifications</h3>
              <ul className="mt-2 space-y-2">
                <li className="p-2 bg-gray-100 rounded">New leave request pending approval</li>
                <li className="p-2 bg-gray-100 rounded">Low inventory alert</li>
                <li className="p-2 bg-gray-100 rounded">Employee attendance report updated</li>
              </ul>
            </div>
          )}
        </div>

        {/* Admin / Employee Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            className="avatar"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-2">
              <img 
                src={userRole === "admin" ? "/images/admin.jpg" : "/images/employee.jpg"} 
                alt="Profile" 
              />
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-3">
              <h3 className="font-bold text-center">
                {userRole === "admin" ? "Admin Profile" : "Employee Profile"}
              </h3>
              <ul className="mt-2 space-y-2">
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">View Profile</li>
                <li className="p-2 hover:bg-gray-100 rounded cursor-pointer">Edit Profile</li>
                <li 
                  className="p-2 hover:bg-red-100 rounded cursor-pointer text-red-600"
                  onClick={handleLogout}
                >
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
