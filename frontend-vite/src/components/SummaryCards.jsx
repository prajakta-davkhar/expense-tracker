import React from "react";

export default function SummaryCards({ budgets }) {
  const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-green-100 rounded">Total Budget: ₹{totalBudget}</div>
      <div className="p-4 bg-red-100 rounded">Total Spent: ₹{totalSpent}</div>
      <div className="p-4 bg-blue-100 rounded">Remaining: ₹{totalBudget - totalSpent}</div>
    </div>
  );
}
