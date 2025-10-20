import { LayoutDashboard, Settings, Users } from "lucide-react";
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

    //========================= Menu Items =========================
    {
      key: ROUTER.ADMIN_OVERVIEW,
      icon: <LayoutDashboard size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_OVERVIEW]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },
    {
      key: ROUTER.ADMIN_USER_MANAGEMENT,
      icon: <Users size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_USER_MANAGEMENT]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    // ------------------------- Divider ------------------------
    {
      type: "divider",
    },
    {
      key: "sub3",
      icon: <Settings size={20} />,
      label: "Settings",
    },
    // ======================= End Menu Items ========================
  ];
  return <MenuLeft items={menuItems} />;
};

export default AdminSideBar;
