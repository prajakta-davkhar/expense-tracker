// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// ✅ Create AuthContext
export const AuthContext = createContext();

// ✅ AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // API URL
  const API_URL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}/api/auth`
    : "http://localhost:5000/api/auth";

  // Load user & token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("AuthContext parse error:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;
      if (!token || !user) throw new Error("Invalid server response");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true, user };
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Invalid email or password",
      };
    }
  };

  // ✅ Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password });
      const { token, user } = res.data;
      if (!token || !user) throw new Error("Invalid server response");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true, user };
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Signup failed",
      };
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // ✅ Update user locally
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        setUser: updateUser,
      }}
    >
      {!loading ? children : <div className="text-center mt-20">Loading...</div>}
    </AuthContext.Provider>
  );
};
