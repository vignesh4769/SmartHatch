import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HiUsers, 
  HiCalendar, 
  HiCash, 
  HiShoppingBag,
  HiCheckCircle,
  HiClock
} from 'react-icons/hi';

const iconComponents = {
  users: <HiUsers className="w-6 h-6" />,
  attendance: <HiCheckCircle className="w-6 h-6" />,
  leave: <HiClock className="w-6 h-6" />,
  salary: <HiCash className="w-6 h-6" />,
  inventory: <HiShoppingBag className="w-6 h-6" />,
  calendar: <HiCalendar className="w-6 h-6" />
};

const DashboardStats = ({ title, value, icon, link }) => {
  return (
    <Link to={link || '#'} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
          {iconComponents[icon] || iconComponents.users}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardStats;