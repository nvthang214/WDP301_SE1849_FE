// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "./dashboardSidebar.jsx";

const routeTitles = {
  "/recruiter/dashboard": "Dashboard",
  "/recruiter/account-settings": "Account Settings",
  "/recruiter/company-info": "Company Information",
  "/recruiter/social-media": "Social Media",
};

export default function DashboardLayout() {
  const location = useLocation();
  const [title, setTitle] = useState("");

  useEffect(() => {
    const newTitle = routeTitles[location.pathname] || "Dashboard";
    setTitle(newTitle);
  }, [location]);

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        <Outlet />
      </main>
    </div>
  );
}