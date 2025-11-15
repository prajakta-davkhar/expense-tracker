import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [thisMonthExpense, setThisMonthExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("-");
  const [remaining, setRemaining] = useState(0);
  const [chartData, setChartData] = useState([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [expenseRes, budgetRes] = await Promise.all([
        fetch(`${API_URL}/api/expenses`, { headers }).then(res => res.json()),
        fetch(`${API_URL}/api/budgets`, { headers }).then(res => res.json()),
      ]);

      const exp = expenseRes.data || [];
      const bud = budgetRes.data || [];

      setExpenses(exp);

      // Total expense
      const total = exp.reduce((acc, e) => acc + (e.amount || 0), 0);
      setTotalExpense(total);

      // This month expense
      const currentMonth = new Date().getMonth();
      const monthTotal = exp
        .filter(e => new Date(e.date).getMonth() === currentMonth)
        .reduce((acc, e) => acc + (e.amount || 0), 0);
      setThisMonthExpense(monthTotal);

      // Top category
      const categoryTotals = {};
      exp.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + (e.amount || 0);
      });
      const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(topCat ? topCat[0] : "-");

      // Remaining budget
      const totalBudget = bud.reduce((acc, b) => acc + (b.limit || 0), 0);
      setRemaining(totalBudget - total);

      // Chart data
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
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
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen +bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <section className="container mx-auto px-6 py-12 lg:py-20">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-center lg:text-left dark:text-gray-100">
            📊 Dashboard
          </h1>
          <div className="flex gap-4 mt-4 lg:mt-0">
            <Link
              to="/add-expense"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
            >
              ➕ Add Expense
            </Link>
            <button
              onClick={fetchData}
              className="bg-gray-300 dark:bg-gray-700 px-4 py-3 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
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
          <h2 className="text-2xl font-semibold mb-4 text-center dark:text-gray-100">📈 Monthly Overview</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#2563eb" name="Expenses" barSize={45} radius={[10,10,0,0]} />
              <Bar dataKey="budgets" fill="#f59e0b" name="Budgets" barSize={45} radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT EXPENSES */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center dark:text-gray-100">🧾 Recent Expenses</h2>
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
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
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
function StatCard({ title, value, color }) {
  const lightColors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800",
  };
  const darkColors = {
    blue: "bg-blue-800 text-blue-100",
    green: "bg-green-800 text-green-100",
    red: "bg-red-800 text-red-100",
    orange: "bg-orange-800 text-orange-100",
  };
  return (
    <div className={`rounded-xl p-6 shadow-lg text-center transition-colors duration-300 hover:scale-105 transform ${lightColors[color]} dark:${darkColors[color]}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
