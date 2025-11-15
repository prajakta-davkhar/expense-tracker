// src/App.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import AddBudget from "./pages/AddBudget";
import Settings from "./pages/Settings";
import NotificationPage from "./pages/NotificationPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// 🔹 PrivateRoute to protect authenticated routes
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // Or add a spinner
  return user ? children : <Navigate to="/login" replace />;
}

// 🔹 Layout wrapper to handle Navbar/Footer visibility and global theme
function LayoutWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const hide = hideNavbarRoutes.includes(location.pathname);

  const { user } = useContext(AuthContext);

  // Global theme state
  const [theme, setTheme] = useState("light");

  // Load theme from user data if logged in
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    } else {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme);
    }
  }, [user]);

  // Apply theme class to <html> element
  useEffect(() => {
    document.documentElement.classList.remove(theme === "light" ? "dark" : "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme); // fallback for non-logged-in users
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {!hide && <Navbar toggleTheme={toggleTheme} currentTheme={theme} />}

      <main className="flex-1 p-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-expense"
            element={
              <PrivateRoute>
                <AddExpense />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-budget"
            element={
              <PrivateRoute>
                <AddBudget />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings theme={theme} setTheme={setTheme} />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationPage />
              </PrivateRoute>
            }
          />

          {/* Redirect old auth path */}
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <h1 className="text-center mt-20 text-red-500 font-semibold text-xl">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>

      {!hide && <Footer />}
    </div>
  );
}

// 🔹 Main App Component
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </AuthProvider>
  );
}
