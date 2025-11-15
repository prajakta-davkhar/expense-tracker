// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API URL (NO LOCALHOST)
  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

  if (!baseURL) {
    console.error("❌ ERROR: VITE_API_BASE_URL is missing in .env");
  }

  const API_URL = `${baseURL}/api/auth`;

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error("⚠️ Failed to parse auth data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true, user };
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  // SIGNUP
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      return { success: true, user };
    } catch (err) {
      console.error("❌ Signup error:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || "Signup failed" };
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // UPDATE USER
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
