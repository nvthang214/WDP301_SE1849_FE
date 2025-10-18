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

const RecruiterSideBar = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      label: "Recruiter Dashboard",
      type: "group",
    },
    {
      key: "/recruiter/overview",
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
    },
    {
      key: "/recruiter/applied",
      icon: <BriefcaseBusiness size={20} />,
      label: "Applied Jobs",
      onClick: ({ key }) => navigate(key),
    },
    {
      key: "sub1",
      icon: <Bookmark size={20} />,
      label: "Favorites Jobs",
    },
    {
      key: "sub2",
      icon: <BellRing size={20} />,
      label: "Jobs Alerts",
    },
    {
      type: "divider",
    },
    {
      key: "sub3",
      icon: <Settings size={20} />,
      label: "Settings",
      extra: "1",
    },
    {
      key: "sub4",
      icon: <LogOut size={20} />,
      label: "Logout",
      extra: "1",
    },
  ];
  return <MenuLeft items={menuItems} />;
};

export default RecruiterSideBar;
