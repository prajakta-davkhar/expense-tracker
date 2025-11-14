// src/components/ExpenseCard.jsx
import React from "react";

// ✅ Utility to format date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ExpenseCard({ expense, className = "", ...props }) {
  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}
      {...props}
    >
      <h3 className="text-lg font-semibold text-gray-800">{expense.title}</h3>
      <p className="text-gray-600 mt-1">Category: {expense.category}</p>
      <p className="text-gray-400 text-sm mt-1">{formatDate(expense.date)}</p>
      <p className="text-indigo-600 font-bold mt-2 text-lg">₹{expense.amount}</p>
    </div>
  );
}
