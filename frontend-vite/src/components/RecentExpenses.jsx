import React from "react";

export default function RecentExpenses({ expenses }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Recent Expenses</h2>
      {expenses.slice(0, 5).map((e) => (
        <div key={e._id} className="flex justify-between p-2 border-b">
          <span>{e.category}</span>
          <span>₹{e.amount}</span>
        </div>
      ))}
    </div>
  );
}
