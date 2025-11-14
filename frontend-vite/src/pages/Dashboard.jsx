import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [thisMonthExpense, setThisMonthExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("—");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔹 Direct backend URL
  const API_URL = "https://expense-tracker-3a4k.onrender.com";

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
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

      // Total expenses
      const total = exp.reduce((acc, e) => acc + (e.amount || 0), 0);
      setTotalExpense(total);

      // This month expenses
      const now = new Date();
      const monthExp = exp
        .filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((acc, e) => acc + (e.amount || 0), 0);
      setThisMonthExpense(monthExp);

      // Top category
      const categoryTotals = {};
      exp.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (e.amount || 0);
      });
      const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(topCat ? topCat[0] : "—");

      // Monthly chart (expenses + budgets)
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const chart = months.map((m, i) => ({
        month: m,
        expenses: exp
          .filter(e => new Date(e.date).getMonth() === i && new Date(e.date).getFullYear() === now.getFullYear())
          .reduce((acc, e) => acc + (e.amount || 0), 0),
        budgets: bud
          .filter(b => new Date(b.createdAt).getMonth() === i && new Date(b.createdAt).getFullYear() === now.getFullYear())
          .reduce((acc, b) => acc + (b.limit || 0), 0),
      }));
      setChartData(chart);

      setError("");
    } catch (err) {
      console.error("Dashboard fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalBudget = budgets.reduce((acc, b) => acc + (b.limit || 0), 0);
  const spentBudget = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const remaining = totalBudget - spentBudget;

  if (loading) return <p className="text-center mt-20">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen +bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <section className="container mx-auto px-6 py-12 lg:py-20">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-center lg:text-left">
            📊 Dashboard
          </h1>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Link to="/add-expense" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all">
              ➕ Add Expense
            </Link>
            <button onClick={fetchData} className="bg-gray-300 dark:bg-gray-700 px-4 py-3 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition">
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Expenses" value={`₹${totalExpense}`} color="blue" />
          <StatCard title="This Month" value={`₹${thisMonthExpense}`} color="green" />
          <StatCard title="Top Category" value={topCategory} color="red" />
          <StatCard title="Remaining Budget" value={`₹${remaining}`} color="orange" />
        </div>

        {/* CHART */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">📈 Monthly Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#2563eb" name="Expenses" barSize={45} radius={[10,10,0,0]} />
              <Bar dataKey="budgets" fill="#f59e0b" name="Budgets" barSize={45} radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT EXPENSES */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">🧾 Recent Expenses</h2>
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
                {expenses
                  .sort((a,b) => new Date(b.date) - new Date(a.date))
                  .slice(0,5)
                  .map((item, i) => (
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
      </section>
    </div>
  );
}

// STAT CARD COMPONENT
const colors = {
  blue: "text-blue-600",
  green: "text-green-600",
  red: "text-red-500",
  orange: "text-orange-500",
};

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center hover:scale-105 transition-transform">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}
