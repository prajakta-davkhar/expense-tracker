import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [chartData, setChartData] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  // 🔹 Direct backend URL
  const API_URL = "https://expense-tracker-2-fcl1.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in!");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };

        const [expenseRes, budgetRes] = await Promise.all([
          axios.get(`${API_URL}/api/expenses`, { headers }),
          axios.get(`${API_URL}/api/budgets`, { headers }),
        ]);

        const exp = expenseRes.data.data || expenseRes.data.expenses || [];
        const bud = budgetRes.data.data || budgetRes.data.budgets || [];

        setExpenses(exp);
        setBudgets(bud);

        const totalExp = exp.reduce((acc, e) => acc + (e.amount || 0), 0);
        const totalBud = bud.reduce((acc, b) => acc + (b.limit || 0), 0);
        setTotalSpent(totalExp);
        setTotalBudget(totalBud);
        setRemainingBudget(totalBud - totalExp);

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const chart = months.map((m, i) => ({
          month: m,
          expenses: exp
            .filter(e => new Date(e.date).getMonth() === i)
            .reduce((acc, e) => acc + (e.amount || 0), 0),
          budgets: bud
            .filter(b => new Date(b.createdAt).getMonth() === i)
            .reduce((acc, b) => acc + (b.limit || 0), 0),
        }));
        setChartData(chart);

      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err.response?.data?.message || "Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/budgets/download-report`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "expense_report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download report!");
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-semibold">Loading Reports...</div>;
  if (error) return <div className="text-center mt-20 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen +bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">📑 Expense & Budget Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Spent" value={`₹${totalSpent}`} color="red" />
        <StatCard title="Total Budget" value={`₹${totalBudget}`} color="blue" />
        <StatCard title="Remaining Budget" value={`₹${remainingBudget}`} color="green" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">📊 Monthly Overview</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            <Bar dataKey="budgets" fill="#3b82f6" name="Budgets" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mb-12">
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
        >
          📥 Download Excel Report
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">🧾 Recent Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(-10).reverse().map((item, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{item.category}</td>
                  <td className="py-3 px-4">{item.description || "—"}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = { red: "text-red-500", green: "text-green-600", blue: "text-blue-600" };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center hover:scale-105 transition-transform">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
