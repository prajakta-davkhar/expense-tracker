import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function AddBudget() {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Direct backend URL (no .env)
  const API_URL = "https://expense-tracker-3a4k.onrender.com";

  // ➕ Add new budget
  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!category || !limit) return toast.error("⚠️ Please fill all fields!");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return toast.error("❌ You must be logged in!");

      const res = await axios.post(
        `${API_URL}/api/budgets`,
        { category, limit: Number(limit) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(`🎯 Budget added for ${category}!`);
        setCategory("");
        setLimit("");
      } else {
        toast.error(res.data.message || "Failed to add budget");
      }
    } catch (err) {
      console.error("❌ Error adding budget:", err);
      toast.error(err.response?.data?.message || "Server error while adding budget");
    } finally {
      setLoading(false);
    }
  };

  // 📥 Download budgets as Excel
  const handleDownloadExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("❌ You must be logged in!");

      const res = await axios.get(`${API_URL}/api/budgets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const budgets = res.data.data || [];
      if (!budgets.length) return toast.error("No budgets to export!");

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Budgets");

      sheet.columns = [
        { header: "Category", key: "category", width: 20 },
        { header: "Limit (₹)", key: "limit", width: 15 },
        { header: "Spent (₹)", key: "spent", width: 15 },
        { header: "Month", key: "month", width: 20 },
      ];

      budgets.forEach((b) =>
        sheet.addRow({
          category: b.category,
          limit: b.limit,
          spent: b.spent,
          month: b.month,
        })
      );

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "Budgets.xlsx");

      toast.success("📥 Excel downloaded!");
    } catch (err) {
      console.error("❌ Error downloading Excel:", err);
      toast.error("Failed to download Excel!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] +bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-white">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
            💰 Add New Budget
          </h2>

          <form onSubmit={handleAddBudget} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Food, Travel, Bills"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Limit (₹)
              </label>
              <input
                type="number"
                placeholder="Enter limit, e.g. 5000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
                min={0}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 shadow-md"
            >
              {loading ? "Saving..." : "➕ Add Budget"}
            </Button>
          </form>

          <Button
            onClick={handleDownloadExcel}
            className="w-full mt-4 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 shadow-md"
          >
            📥 Download Excel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
