import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome,
  FiCalendar,
  FiMail,
  FiCoffee,
  FiDollarSign,
  FiPackage
} from "react-icons/fi";

const SidebarEmployee = () => {
  const location = useLocation();

  const navItems = [
    { path: "/employee/dashboard", icon: <FiHome size={18} />, label: "Dashboard" },
    { path: "/employee/attendance", icon: <FiCalendar size={18} />, label: "My Attendance" },
    { path: "/employee/salary", icon: <FiDollarSign size={18} />, label: "My Salary" },
    { path: "/employee/stock-requests", icon: <FiPackage size={18} />, label: "Stock Requests" },
    { path: "/employee/mess-schedule", icon: <FiCoffee size={18} />, label: "Mess Schedule" }
  ];

  return (
    <aside className="w-64 h-screen bg-base-200 p-5 fixed shadow-lg">
      <div className="flex items-center mb-5">
        <img 
          src="C:\SmartHatch\frontend\public\images\employee-avatar.jpg" 
          className="w-12 h-12 rounded-full" 
          alt="Employee"
          onError={(e) => {
            e.target.src = "/images/default-avatar.svg";
          }}
        />
        <h2 className="ml-3 text-xl font-bold">Employee Portal</h2>
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
                    : "text-gray-700 hover:bg-gray-100"
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

export default SidebarEmployee;