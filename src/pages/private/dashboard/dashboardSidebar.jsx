"use client";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  PlusCircle,
  Briefcase,
  Bookmark,
  CreditCard,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/recruiter/dashboard" },
  { icon: User, label: "Employer Profile", href: "/recruiter/dashboard/profile" },
  { icon: PlusCircle, label: "Post a Job", href: "/recruiter/dashboard/post-job" },
  { icon: Briefcase, label: "My Jobs", href: "/recruiter/dashboard/my-jobs" },
  { icon: Bookmark, label: "Saved Candidates", href: "/recruiter/dashboard/saved-candidates" },
  { icon: CreditCard, label: "Plans & Billing", href: "/recruiter/dashboard/billing" },
  { icon: Building2, label: "All Companies", href: "/recruiter/dashboard/companies" },
  { icon: Settings, label: "Account Settings", href: "/recruiter/account-settings" },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: thêm logic logout thật (xóa token, v.v.)
    console.log("User logged out!");
    navigate("/login");
  };

  return (
    <aside className="relative w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between">
      {/* Top section */}
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Recruiter Dashboard
        </h2>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
