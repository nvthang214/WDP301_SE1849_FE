import { LayoutDashboard, Settings, Users, FileText, Tag, FolderTree } from "lucide-react";
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
    {
      key: ROUTER.ADMIN_UPGRADE_REQUESTS,
      icon: <FileText size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_UPGRADE_REQUESTS]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },
    {
      key: ROUTER.ADMIN_TAG_MANAGEMENT,
      icon: <Tag size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_TAG_MANAGEMENT]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },
    {
      key: ROUTER.ADMIN_CATEGORY_MANAGEMENT,
      icon: <FolderTree size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_CATEGORY_MANAGEMENT]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    // ------------------------- Divider ------------------------
    {
      type: "divider",
    },
    {
      key: ROUTER.ADMIN_SETTINGS,
      icon: <Settings size={20} />,
      label: ROUTE_META[ROUTER.ADMIN_SETTINGS]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },
    // ======================= End Menu Items ========================
  ];
  return <MenuLeft items={menuItems} />;
};

export default AdminSideBar;
