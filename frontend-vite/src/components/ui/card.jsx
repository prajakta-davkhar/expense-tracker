// src/components/Card.jsx
import React from "react";

// 🔹 Card wrapper
export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// 🔹 Card content wrapper
export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
