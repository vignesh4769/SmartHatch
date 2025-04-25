import React, { useEffect, useState } from "react";
import api from "../../api/config";
import { useAuth } from "../../context/AuthContext";

const AdminNotifications = ({ type = "inventory" }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user?.token) throw new Error("Authentication token is missing");
        const res = await api.get(`/api/admin/notifications?type=${type}`);
        setNotifications(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user, type]);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!notifications.length) return <div>No notifications.</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Stock Request Notifications</h2>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notif) => (
          <li key={notif._id} className="py-2">
            <div className="font-medium">{notif.title}</div>
            <div className="text-sm text-gray-600">{notif.message}</div>
            <div className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNotifications;
