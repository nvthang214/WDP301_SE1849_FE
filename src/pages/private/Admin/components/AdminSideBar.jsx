import {
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import MenuLeft from "../../../../components/MenuLeft";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../../router/ROUTER";
import ROUTE_META from "../../../../router/ROUTER_META";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Admin Dashboard",
      type: "group",
    },
    {
      key: ROUTER.ADMIN_DASHBOARD,
      icon: <LayoutDashboard size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_DASHBOARD]?.breadcrumb,
    },
    {
      key: "/admin/applied",
      icon: <BriefcaseBusiness size={20} />,
      label: "Applied Jobs",
      onClick: ({ key }) => navigate(key),
    },
    {
      key: "sub1",
      icon: <Bookmark size={20} />,
      label: "Post a Job",
    },
    {
      key: "sub2",
      icon: <BellRing size={20} />,
      label: "My Jobs",
    },

    // phần phân cách
    {
      type: "divider",
    },
    {
      key: "sub3",
      icon: <Settings size={20} />,
      label: "Settings",
    },
    {
      key: "sub4",
      icon: <LogOut size={20} />,
      label: "Logout",
    },
  ];
  return <MenuLeft items={menuItems} />;
};

export default AdminSideBar;
