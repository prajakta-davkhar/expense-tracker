import React from "react";

export default function NotificationsPanel({ notifications }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Notifications</h2>
      {notifications.slice(0, 5).map((n) => (
        <div
          key={n._id}
          className={`p-2 border-b ${n.isRead ? "" : "bg-yellow-100"}`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}
