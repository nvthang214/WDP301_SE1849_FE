import { LayoutDashboard, Settings, BriefcaseBusiness, Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuLeft from "../../../../components/MenuLeft";
import ROUTER from "../../../../router/ROUTER";
import ROUTE_META from "../../../../router/ROUTER_META";

const RecruiterSideBar = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Recruiter Dashboard",
      type: "group",
    },
    //========================= Menu Items =========================
    {
      key: ROUTER.RECRUITER_OVERVIEW,
      icon: <LayoutDashboard size={20} />,
      label: ROUTE_META[ROUTER.RECRUITER_OVERVIEW]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    {
      key: ROUTER.RECRUITER_MY_JOBS,
      icon: <BriefcaseBusiness size={20} />,
      label: ROUTE_META[ROUTER.RECRUITER_MY_JOBS]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    {
      key: ROUTER.RECRUITER_APPLICATIONS,
      icon: <Users size={20} />,
      label: ROUTE_META[ROUTER.RECRUITER_APPLICATIONS]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    {
      key: ROUTER.RECRUITER_MY_COMPANY,
      icon: <Building2 size={20} />,
      label: ROUTE_META[ROUTER.RECRUITER_MY_COMPANY]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    // ------------------------- Divider ------------------------
    {
      type: "divider",
    },
    {
      key: ROUTER.ACCOUNT_SETTINGS,
      icon: <Settings size={20} />,
      label: "Settings",
      onClick: ({ key }) => navigate(key),
    },
    // ======================= End Menu Items ========================
  ];
  return <MenuLeft items={menuItems} />;
};

export default RecruiterSideBar;