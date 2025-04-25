import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCoffee,
  FiFileText,
  FiDollarSign,
  FiPackage
} from "react-icons/fi";

const Sidebar = ({ userRole = "employee" }) => {
  const location = useLocation();

  const adminNavItems = [
    {
      path: "/admin/employees",
      icon: <FiUsers size={18} />,
      label: "Employee Management",
    },
    {
      path: "/admin/attendance",
      icon: <FiCalendar size={18} />,
      label: "Attendance",
    },
    {
      path: "/admin/leaves",
      icon: <FiFileText size={18} />,
      label: "Leave Approval",
    },
    {
      path: "/admin/mess",
      icon: <FiCoffee size={18} />,
      label: "Mess Management",
    },
  ];

  const employeeNavItems = [
    { path: "/employee/attendance", icon: <FiCalendar size={18} />, label: "My Attendance" },
    { path: "/employee/leaves", icon: <FiFileText size={18} />, label: "My Leaves" },
    { path: "/employee/stock-requests", icon: <FiPackage size={18} />, label: "Stock Requests" },
    { path: "/employee/mess-schedule", icon: <FiCoffee size={18} />, label: "Mess Schedule" }
  ];

  const navItems = userRole === "admin" ? adminNavItems : employeeNavItems;
  const isAdmin = userRole === "admin";

  return (
    <aside className={`w-64 h-screen p-5 fixed shadow-lg ${isAdmin ? 'bg-gray-900' : 'bg-gray-900'} text-white`}>
      <div className="flex items-center mb-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiHome className="mr-2" size={20} />
          {isAdmin ? 'Admin Panel' : 'Employee Portal'}
        </h2>
      </div>
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? "bg-gray-700 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
