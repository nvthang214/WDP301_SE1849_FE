import {
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
} from "lucide-react";
import MenuLeft from "../../../../components/MenuLeft";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../../router/ROUTER";
import ROUTE_META from "../../../../router/ROUTER_META";

const CandidateSideBar = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Candidate Dashboard",
      type: "group",
    },

    //========================= Menu Items =========================
    {
      key: ROUTER.CANDIDATE_OVERVIEW,
      icon: <LayoutDashboard size={20} />,
      label: ROUTE_META[ROUTER.CANDIDATE_OVERVIEW]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },

    // ------------------------- Divider ------------------------
    {
      type: "divider",
    },
    {
      key: ROUTER.CANDIDATE_APPLY_JOB,
      icon: <BriefcaseBusiness size={20} />,
      label: "Applied Jobs",
      onClick: ({ key }) => navigate(key),
    },
    {
      key: ROUTER.CANDIDATE_REQUEST_UPGRADE,
      icon: <TrendingUp size={20} />,
      label: ROUTE_META[ROUTER.CANDIDATE_REQUEST_UPGRADE]?.breadcrumb,
      onClick: ({ key }) => navigate(key),
    },
    {
      key: ROUTER.CANDIDATE_PROFILE,
      icon: <Settings size={20} />,
      label: "Settings",
      onClick: ({ key }) => navigate(key),
    },
    //======================= End Menu Items ========================
  ];
  return <MenuLeft items={menuItems} />;
};

export default CandidateSideBar;
