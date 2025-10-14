import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
       LayoutDashboard,
       Briefcase,
       Bookmark,
       Settings,
       LogOut,
} from "lucide-react";

const SidebarMain = ({ role = "recruiter" }) => {
       const navigate = useNavigate();

       const menuItems = [
              { icon: LayoutDashboard, label: "Overview", href: "/recruiter/dashboard" },
              { icon: Briefcase, label: "My Jobs", href: "/recruiter/jobs" },
              { icon: Bookmark, label: "Saved Candidates", href: "/recruiter/saved" },
              { icon: Settings, label: "Account Settings", href: "/recruiter/account-settings" },
       ];

       const handleLogout = () => {
              console.log("Logged out!");
              navigate("/login");
       };

       return (
              <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between">
                     {/* Logo/Brand */}
                     <div className="p-6 border-b border-gray-100">
                            <h1 className="text-xl font-bold text-gray-800">JobPilot</h1>
                            <p className="text-sm text-gray-500 mt-1">Recruiter Dashboard</p>
                     </div>

                     {/* Menu items */}
                     <div className="flex-1 p-4">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wide">
                                   {role === "admin" ? "Admin Menu" : "Main Menu"}
                            </h2>

                            <nav className="space-y-2">
                                   {menuItems.map((item) => {
                                          const Icon = item.icon;
                                          return (
                                                 <NavLink
                                                        key={item.href}
                                                        to={item.href}
                                                        className={({ isActive }) =>
                                                               `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                                                                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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

                     {/* Logout */}
                     <div className="p-4 border-t border-gray-100">
                            <button
                                   onClick={handleLogout}
                                   className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg w-full transition-all"
                            >
                                   <LogOut className="w-5 h-5" />
                                   Log Out
                            </button>
                     </div>
              </aside>
       );
};

export default SidebarMain;