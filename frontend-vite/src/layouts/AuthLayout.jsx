// src/layouts/AuthLayout.jsx
import { Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];

  // ✅ Login/Signup साठी navbar hide करा
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
