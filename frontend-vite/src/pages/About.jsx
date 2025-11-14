import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero-larger.jpg"; // Ensure image is placed in src/assets/

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <section className="container mx-auto px-6 py-12 lg:py-20">

        {/* 🌟 HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 text-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 text-blue-700 dark:text-blue-400">
              Smart Expense Tracker
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl leading-relaxed">
              <strong>Smart Expense Tracker</strong> is a simple yet powerful web application
              designed to help you record your daily expenses, set budgets, and analyze
              spending patterns. It’s built to make money management effortless and insightful.
            </p>

            <div className="space-y-3">
              <p className="font-semibold text-blue-700 dark:text-blue-300">🎯 Key Objectives:</p>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                <li>Record and categorize your daily expenses.</li>
                <li>Generate monthly charts and spending summaries.</li>
                <li>Set and manage budget limits to control spending.</li>
                <li>Visualize data with clear, colorful reports.</li>
                <li>Access everything easily — mobile-friendly design.</li>
              </ul>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
              >
                🚀 Go to Dashboard
              </Link>
              <Link
                to="/"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition"
              >
                ⬅ Back to Home
              </Link>
            </div>
          </div>

          {/* 🖼️ IMAGE SECTION */}
          <div className="lg:w-1/2 w-full flex justify-center">
            <img
              src={hero}
              alt="Expense tracker dashboard preview"
              className="w-full max-w-3xl rounded-3xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* 🧭 STEP-BY-STEP USER GUIDE */}
        <div className="mt-16 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
            🧾 How to Use — Step by Step Guide
          </h2>

          <ol className="space-y-6 text-gray-700 dark:text-gray-300 list-decimal ml-6 leading-relaxed">
            <li>
              <strong>1️⃣ Create Your Profile:</strong> Go to <em>Settings</em> and enter your name, email, and profile photo. 
              This helps personalize your dashboard and reports.
            </li>

            <li>
              <strong>2️⃣ Set Your Budget:</strong> Define how much you want to spend per month. 
              Example: “Food — ₹5000”, “Travel — ₹2000”.
            </li>

            <li>
              <strong>3️⃣ Add an Expense:</strong> Go to <em>Add Expense</em> → Enter Amount, Category, Date, and Notes → Click Save.  
              Example: ₹150 — Food — 2025-11-03 — “Lunch at Cafe”.
            </li>

            <li>
              <strong>4️⃣ View Dashboard:</strong> Your Dashboard shows total spending, charts, and progress bars for each category.
              It updates automatically every time you add or delete an expense.
            </li>

            <li>
              <strong>5️⃣ Analyze Reports:</strong> Go to the <em>Reports</em> page to view category-wise or monthly summaries. 
              You can even download or print your reports.
            </li>

            
          </ol>
        </div>

        {/* 🔗 QUICK ACTION LINKS */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/add-expense"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            ➕ Add Expense
          </Link>
          <Link
            to="/reports"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
          >
            📊 View Reports
          </Link>
          <Link
            to="/settings"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
          >
            ⚙️ Open Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
