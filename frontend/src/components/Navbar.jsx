import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBell, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import {
  HiOutlineCash,
  HiOutlineUsers,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import {
  MdDashboard,
  MdOutlineDirectionsWalk,
  MdOutlineEmail,
} from "react-icons/md";

function Navbar({ userRole }) {
  const { logout, user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Sample notifications - replace with actual API call
  useEffect(() => {
    const fetchNotifications = async () => {
      // In a real app, you would fetch from your API
      const sampleNotifications = [
        {
          id: 1,
          message: "New leave request pending approval",
          read: false,
          date: "2025-04-22",
        },
        {
          id: 2,
          message: "Low inventory alert for Feed",
          read: false,
          date: "2025-04-22",
        },
        {
          id: 3,
          message: "Salary processed for June",
          read: true,
          date: "2025-04-22",
        },
      ];
      setNotifications(sampleNotifications);
    };

    fetchNotifications();
  }, []);

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className="bg-gray-800 text-white shadow-sm h-16 z-50 flex items-center justify-between px-6 fixed top-0 left-0 w-full shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link
          to={userRole === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
          className="flex items-center"
        >
          <img
            src="/images/logo.jpg"
            className="w-10 h-10 rounded-full mr-3"
            alt="SmartHatch Logo"
          />
          <span className="text-xl font-bold hidden sm:inline">SmartHatch</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden lg:flex flex-1 justify-center">
        <ul className="flex space-x-6">
          {/* Dashboard Link */}
          <li>
            <Link
              to={
                userRole === "admin"
                  ? "/admin/dashboard"
                  : "/employee/dashboard"
              }
              className={`flex items-center hover:text-gray-300 ${
                location.pathname === "/admin/dashboard" ||
                location.pathname === "/employee/dashboard"
                  ? "text-indigo-300"
                  : ""
              }`}
            >
              <MdDashboard className="mr-1" /> Dashboard
            </Link>
          </li>

          {userRole === "admin" && (
            <>
              <li>
                <Link
                  to="/admin/visitors"
                  className={`flex items-center hover:text-gray-300 ${
                    location.pathname === "/admin/visitors"
                      ? "text-indigo-300"
                      : ""
                  }`}
                >
                  <MdOutlineDirectionsWalk className="mr-1" /> Visitors
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/inventory"
                  className={`flex items-center hover:text-gray-300 ${
                    location.pathname === "/admin/inventory"
                      ? "text-indigo-300"
                      : ""
                  }`}
                >
                  <HiOutlineShoppingBag className="mr-1" /> Inventory
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/financial"
                  className={`flex items-center hover:text-gray-300 ${
                    location.pathname === "/admin/financial"
                      ? "text-indigo-300"
                      : ""
                  }`}
                >
                  <HiOutlineCash className="mr-1" /> Financial
                </Link>
              </li>
            </>
          )}

          {userRole === "employee" && (
            <>
              <li>
                <Link
                  to="/employee/attendance"
                  className={`flex items-center hover:text-gray-300 ${
                    location.pathname === "/employee/attendance"
                      ? "text-indigo-300"
                      : ""
                  }`}
                >
                  <MdOutlineEmail className="mr-1" /> Attendance
                </Link>
              </li>
              <li>
                <Link
                  to="/employee/leave-application"
                  className={`flex items-center hover:text-gray-300 ${
                    location.pathname === "/employee/leave-application"
                      ? "text-indigo-300"
                      : ""
                  }`}
                >
                  <MdOutlineEmail className="mr-1" /> Leave
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="p-2 hover:bg-gray-700 rounded-full focus:outline-none relative"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifications"
          >
            <FiBell className="text-xl" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-10 text-gray-800">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-bold flex justify-between items-center">
                  <span>Notifications</span>
                  <button
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                    onClick={() =>
                      setNotifications(
                        notifications.map((n) => ({ ...n, read: true }))
                      )
                    }
                  >
                    Mark all as read
                  </button>
                </h3>
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <p>{notification.message}</p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 mt-1"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.date}
                      </p>
                    </li>
                  ))
                ) : (
                  <li className="p-4 text-center text-gray-500">
                    No notifications
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center focus:outline-none hover:bg-gray-700 rounded-full p-1"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 mr-2">
              <img
                src={
                  user?.profileImage ||
                  (userRole === "admin"
                    ? "/images/admin.jpg"
                    : "/images/employee.jpg")
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="hidden md:inline">{user?.name}</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden z-10 text-gray-800">
              <div className="p-3 border-b border-gray-200">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ul className="py-1">
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      navigate("/profile");
                      setIsProfileOpen(false);
                    }}
                  >
                    <FiUser className="mr-2" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      navigate("/settings");
                      setIsProfileOpen(false);
                    }}
                  >
                    <FiSettings className="mr-2" /> Settings
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center text-red-600"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
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
