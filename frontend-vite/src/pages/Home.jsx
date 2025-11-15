import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import hero from "../assets/hero.jpg";
import feature1 from "../assets/feature1.jpg";
import feature2 from "../assets/feature2.jpg";
import feature3 from "../assets/feature3.jpg";

export default function Home() {
  const location = useLocation();

  // ✅ Force reload on every visit to "/"
  useEffect(() => {
    if (location.pathname === "/") {
      window.scrollTo(0, 0); // smooth UX
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen +bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-lg">
            💸 Smart Expense Tracker
          </h1>
          <p className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto text-gray-100">
            Manage your daily spending effortlessly! Track, analyze, and control
            your finances with smart insights and beautiful reports.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              🚀 Get Started
            </Link>
            <Link
              to="/about"
              className="border border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-700 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-12">✨ Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Feature
              img={feature1}
              title="💰 Easy Tracking"
              desc="Quickly log your daily expenses and categorize them by type for smarter tracking."
              link="/add-expense"
              linkText="Try it →"
            />
            <Feature
              img={feature2}
              title="📊 Smart Reports"
              desc="Visualize your monthly spending through colorful charts and detailed analytics."
              link="/reports"
              linkText="View Reports →"
            />
            <Feature
              img={feature3}
              title="⚙️ Custom Settings"
              desc="Manage your profile, switch themes, and control privacy settings easily."
              link="/settings"
              linkText="Go to Settings →"
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
}

// ✅ Reusable feature card
function Feature({ img, title, desc, link, linkText }) {
  return (
    <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:scale-105 transition-transform">
      <img src={img} alt={title} className="rounded-2xl mb-6 w-full h-56 object-cover" />
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{desc}</p>
      <Link to={link} className="text-blue-600 mt-4 inline-block hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
