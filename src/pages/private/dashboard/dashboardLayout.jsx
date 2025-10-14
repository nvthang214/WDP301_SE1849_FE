// src/components/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader from "../layout-header/layout.jsx"; // ✅ Sửa đúng tên import (chú ý chữ viết hoa)
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
    // ✅ Bọc toàn bộ nội dung bằng DashboardHeader
    <DashboardHeader>
      <div style={{ padding: 24 }}>
        {title && <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>{title}</h1>}
        <Outlet />
      </div>
    </DashboardHeader>
  );
}
