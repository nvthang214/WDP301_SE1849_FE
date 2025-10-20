import {
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import MenuLeft from "../../../../components/MenuLeft";

const RecruiterSideBar = () => {
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
      key: "/recruiter/account",
      icon: <Settings size={20} />,
      label: "Settings",
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
