import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome,
  FiUsers,
  FiCalendar,
  FiCoffee,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/employees", icon: <FiUsers size={18} />, label: "Employee Management" },
    { path: "/admin/attendance", icon: <FiCalendar size={18} />, label: "Attendance" },
    { path: "/admin/leaves", icon: <FiFileText size={18} />, label: "Leave Approval" },
    { path: "/admin/runs", icon: <FiTrendingUp size={18} />, label: "Run Management" },
    { path: "/admin/mess", icon: <FiCoffee size={18} />, label: "Mess Management" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed shadow-lg">
      <h2 className="text-xl font-bold mb-6 pt-4 px-2 flex items-center">
        <FiHome className="mr-2" size={20} />
        Admin Panel
      </h2>
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
    </div>
  );
};

export default AdminSidebar;