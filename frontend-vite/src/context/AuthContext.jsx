// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object
  const [loading, setLoading] = useState(true); // auth loading
  const [theme, setTheme] = useState("light"); // global theme

  // ✅ API URL (no localhost)
  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (!baseURL) console.error("❌ VITE_API_BASE_URL is missing in .env");
  const API_URL = `${baseURL}/api/auth`;

  // Load user & theme from localStorage (guest fallback)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedTheme = localStorage.getItem("theme");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        if (parsedUser.theme) setTheme(parsedUser.theme); // user theme from backend
      } catch (err) {
        console.error("⚠️ Failed to parse auth data:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else if (storedTheme) {
      setTheme(storedTheme); // fallback for guest users
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
      if (user.theme) setTheme(user.theme);

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
      if (user.theme) setTheme(user.theme);

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
    setTheme("light"); // reset theme
  };

  // UPDATE USER (profile changes, including theme)
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    if (updatedUser.theme) setTheme(updatedUser.theme);
  };

  // SAVE theme for guest users
  useEffect(() => {
    if (!user) localStorage.setItem("theme", theme);
  }, [theme, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        setTheme,
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
