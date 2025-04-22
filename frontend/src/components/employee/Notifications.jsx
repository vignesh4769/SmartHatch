import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';
import { FiDollarSign } from 'react-icons/fi';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/employee/notifications');
        setNotifications(response.data.filter(n => n.type === 'salary'));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    if (user) fetchNotifications();
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FiDollarSign className="text-green-600" />
        Salary Notifications
      </h3>
      {notifications.map(notification => (
        <div key={notification._id} className="p-3 bg-gray-50 rounded mb-2">
          <p className="text-sm text-gray-700">{notification.message}</p>
          <span className="text-xs text-gray-500">
            {new Date(notification.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}