// src/components/Navbar.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Wallet,
  BarChart3,
  PlusCircle,
  Settings,
  Home,
  Bell,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Use environment variable or fallback (NO localhost after deploy)
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setNotifications(fetched);
      setError("");
    } catch (err) {
      console.error("🔴 Notification Fetch Error:", err.response?.data || err.message);
      setError("Failed to fetch notifications");
    }
  };

  // 🔹 Auto refresh notifications every 10 sec
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Dashboard", path: "/dashboard", icon: <Wallet size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={20} /> },
    { name: "Add Expense", path: "/add-expense", icon: <PlusCircle size={20} /> },
    { name: "Add Budget", path: "/add-budget", icon: <PlusCircle size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        location.pathname === item.path
          ? "bg-blue-600 text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800"
      }`}
    >
      {item.icon}
      {item.name}
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Expense Tracker
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}

              {/* Notifications */}
              <button
                onClick={() => navigate("/notifications")}
                className="relative"
                title="Notifications"
              >
                <Bell size={22} className="text-gray-700 dark:text-gray-200" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-6 py-4 flex flex-col gap-4">
          {user ? (
            <>
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}

              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                Logout
              </button>

              <button
                onClick={() => {
                  navigate("/notifications");
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600"
              >
                <Bell size={20} />
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm px-6">{error}</p>}
    </nav>
  );
}
