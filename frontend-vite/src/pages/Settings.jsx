import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { LogOut, Edit3, Save } from "lucide-react";

export default function Settings() {
  const { user, setUser, logout } = useContext(AuthContext);
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

  // 🔹 Use Render backend URL
  const API_URL = "https://expense-tracker-2-fcl1.onrender.com";

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
        if (formData[key]) form.append(key, formData[key]); // skip empty password
      }

      if (profileImage) form.append("profileImage", profileImage);

      const res = await axios.put(`${API_URL}/api/auth/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        setUser(res.data); // update context
        setPreviewImage(res.data.profileImage ? `${API_URL}${res.data.profileImage}` : null);
        setMessage("✅ Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      setMessage("❌ Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My Profile</h1>

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

      <div className="space-y-4">
        {["name", "email", "phone", "address", "password"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit3 size={18} /> Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Save size={18} /> Save
          </button>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {message && <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>}
    </div>
  );
}
