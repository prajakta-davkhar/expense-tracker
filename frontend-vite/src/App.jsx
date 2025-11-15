// src/App.jsx
import React, { useContext } from "react";
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

// 🔹 PrivateRoute to protect routes
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // Or a spinner
  return user ? children : <Navigate to="/login" replace />;
}

// 🔹 Layout wrapper to hide Navbar/Footer on login/signup
function LayoutWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const hide = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {!hide && <Navbar />}

      <main className="flex-1 p-6">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
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
                <Settings />
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

          {/* 404 fallback */}
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
