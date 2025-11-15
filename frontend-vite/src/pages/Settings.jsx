import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LogOut, Edit3, Save } from "lucide-react";

export default function Settings() {
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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        password: "",
      });
      setPreviewImage(
        user.profileImage ? `${API_URL}${user.profileImage}` : null
      );
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const form = new FormData();
      for (const key in formData) {
        // Skip empty password
        if (key === "password" && !formData[key]) continue;
        if (formData[key]) form.append(key, formData[key]);
      }

      if (profileImage) form.append("profileImage", profileImage);

      const res = await axios.put(`${API_URL}/api/auth/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        setUser(res.data);
        setPreviewImage(
          res.data.profileImage ? `${API_URL}${res.data.profileImage}` : null
        );
        setMessage("✅ Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("❌ Failed to update profile");
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10 text-lg text-red-600">
        Please login to access settings
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        ⚙️ Settings
      </h1>

      {message && (
        <p className="text-center mb-4 font-medium text-gray-700 dark:text-gray-200">
          {message}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile"
              className="w-28 h-28 rounded-full mb-2 object-cover"
            />
          )}
          {isEditing && <input type="file" onChange={handleImageChange} />}
        </div>

        {/* Form Fields */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Name"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Phone"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="Address"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="New Password (leave blank to keep old)"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Save size={16} /> Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Edit3 size={16} /> Edit
            </button>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
