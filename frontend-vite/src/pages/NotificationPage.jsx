import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Bell, Check, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  // Delete single notification
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  // Mark all as read
  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all as read");
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/notifications/clear-all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear notifications");
    }
  };

  if (!user) return <p className="text-center mt-10">⚠ Please login to view notifications.</p>;
  if (loading) return <p className="text-center mt-10">Loading notifications...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-600">
          <Bell /> Notifications
        </h1>
        <div className="flex gap-3">
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Mark All Read
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications yet 🎉</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`flex justify-between items-center p-4 rounded-xl border ${
                n.isRead
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  : "bg-blue-50 dark:bg-blue-900 text-gray-800"
              } transition`}
            >
              <p>{n.message}</p>
              <div className="flex gap-3">
                {!n.isRead && (
                  <button onClick={() => markAsRead(n._id)} title="Mark as read">
                    <Check size={20} className="text-green-600 hover:text-green-800" />
                  </button>
                )}
                <button onClick={() => deleteNotification(n._id)} title="Delete">
                  <Trash2 size={20} className="text-red-600 hover:text-red-800" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
