import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Logo */}
        <div className="font-bold text-lg md:text-xl">
          Expense Tracker
        </div>

        {/* Links (Pages + Account) */}
        <div className="flex flex-col md:flex-row md:space-x-4 items-center text-sm">
          {/* Pages */}
          <div className="flex flex-col space-y-0.5 text-center md:text-left">
            
          </div>

          {/* Account */}
          <div className="flex flex-col space-y-0.5 text-center md:text-left">
            <span className="font-semibold mb-1">Account</span>
            <a href="/login" className="hover:text-yellow-300 transition">Login</a>
            <a href="/signup" className="hover:text-yellow-300 transition">Sign Up</a>
            <a href="/settings" className="hover:text-yellow-300 transition">Settings</a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex space-x-3 text-sm">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
            Github
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
            LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition">
            Twitter
          </a>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-4 text-center text-gray-200 text-xs">
        &copy; {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </div>
    </footer>
  );
}
