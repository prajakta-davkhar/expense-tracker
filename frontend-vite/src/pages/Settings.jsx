// src/pages/Settings.jsx
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LogOut, Edit3, Save, Moon, Sun } from "lucide-react";

export default function Settings({ theme, setTheme }) {
  const { user, setUser, logout } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        password: "",
      });
      setPreviewImage(user.profileImage ? `${API_URL}${user.profileImage}` : null);
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Save profile changes including theme
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const form = new FormData();
      for (const key in formData) {
        if (key === "password" && !formData[key]) continue;
        if (formData[key]) form.append(key, formData[key]);
      }
      if (profileImage) form.append("profileImage", profileImage);
      form.append("theme", theme); // send theme to backend

      const res = await axios.put(`${API_URL}/api/auth/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        setUser(res.data.user); // update user context
        setPreviewImage(res.data.user.profileImage ? `${API_URL}${res.data.user.profileImage}` : null);
        setMessage("✅ Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      setMessage("❌ Failed to update profile");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg text-red-600">
        Please login to access settings
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My Profile</h1>

      {/* Theme toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>

      {message && (
        <p className="text-center mb-4 font-medium text-gray-700 dark:text-gray-200">{message}</p>
      )}

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={previewImage || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <Edit3 size={18} color="white" />
            </label>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {["name", "email", "phone", "address", "password"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {field === "password" ? "New Password" : field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              disabled={field === "email" || !isEditing}
              placeholder={field === "password" ? "Leave blank to keep old" : ""}
              className={`w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white ${
                field === "email" ? "bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-300" : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 size={18} /> Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save size={18} /> Save
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
