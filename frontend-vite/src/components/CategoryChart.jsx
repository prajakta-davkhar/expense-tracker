// src/components/CategoryChart.jsx
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4f46e5", "#6366f1", "#3b82f6", "#06b6d4", "#22c55e", "#facc15", "#f87171"];

export default function CategoryChart({ expenses }) {
  // ✅ Aggregate expenses by category
  const data = useMemo(() => {
    const map = {};
    expenses.forEach((exp) => {
      if (!map[exp.category]) map[exp.category] = 0;
      map[exp.category] += Number(exp.amount);
    });
    return Object.keys(map).map((key) => ({ name: key, value: map[key] }));
  }, [expenses]);

  if (data.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No expenses to display</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label={(entry) => `${entry.name}: ₹${entry.value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
