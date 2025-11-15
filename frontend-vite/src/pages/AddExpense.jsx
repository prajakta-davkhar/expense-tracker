import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function AddExpense() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (!API_URL) console.error("❌ VITE_API_BASE_URL missing in .env");

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast.error("⚠ Please login first!");
    if (!formData.category || !formData.amount || !formData.date)
      return toast.error("⚠ Fill all required fields!");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/api/expenses`,
        { ...formData, amount: Number(formData.amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "💾 Expense added successfully!");
      setFormData({ category: "", amount: "", description: "", date: "" });
      navigate("/reports");
    } catch (err) {
      console.error("❌ Error adding expense:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to add expense!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-600">
          ➕ Add New Expense
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div>
            <label className="block font-semibold mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
              required
            >
              <option value="">Select category</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Others</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-semibold mb-2">Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
              required
              min={0}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="E.g., Dinner at restaurant"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
              required
            />
          </div>

          <div className="flex justify-between mt-8">
            <Link
              to="/dashboard"
              className="px-5 py-3 bg-gray-300 dark:bg-gray-700 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              ⬅ Back
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "💾 Save Expense"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/reports"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            📊 View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
