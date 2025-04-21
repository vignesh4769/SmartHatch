import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle, FaCalendarAlt, FaFileAlt, FaMoneyBillWave, FaBox, FaUtensils } from "react-icons/fa";

function EmployeeDashboard() {
  const { user } = useAuth(); // Removed logout from destructuring
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaCalendarAlt />, title: "My Attendance", path: "/employee/attendance" },
    { icon: <FaFileAlt />, title: "My Leaves", path: "/employee/leave-application" },
    { icon: <FaFileAlt />, title: "Apply Leave", path: "/apply-leave" },
    { icon: <FaMoneyBillWave />, title: "My Salary", path: "/employee/salary" },
    { icon: <FaBox />, title: "Stock Requests", path: "/employee/stock-requests" },
    { icon: <FaUtensils />, title: "Mess Schedule", path: "/mess" },
  ];

  return (
    <div className="flex">
   
      <div className="w-64 min-h-screen bg-gray-900 text-white p-6">
        <div className="mb-8">
          <img src="/logo.png" alt="SmartHatch" className="h-12 mb-4" />
        </div>
        <nav>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800 mb-2 transition-all"
            >
              <div className="text-xl">{item.icon}</div>
              <span>{item.title}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-8 bg-gray-100">
       
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-6"> 
            <div className="bg-blue-100 p-4 rounded-full">
              <FaUserCircle className="text-6xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome, {user.name}
              </h2>
              <p className="text-lg text-gray-600">{user.hatcheryName}</p>
              <div className="mt-3 text-gray-500">
                <p>Employee ID: {user.employeeId}</p>
                <p>Email: {user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white rounded-xl shadow-md p-8 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="text-3xl text-blue-600">{item.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;