import { AppstoreOutlined, PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { App, Layout, Menu, Modal } from "antd";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import ROUTER from "../../router/ROUTER";
const { Sider } = Layout;

const MenuLeft = ({
  items = [
    {
      key: ROUTER.CANDIDATE_OVERVIEW,
      icon: <PieChartOutlined />,
      label: "Overview",
    },
    {
      key: ROUTER.RECRUITER_APPLICATIONS,
      icon: <AppstoreOutlined />,
      label: "Applications",
    },
    {
      key: ROUTER.CANDIDATE_APPLY_JOB,
      icon: <UserOutlined />,
      label: "Applied Jobs",
    },
  ],
}) => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      Modal.confirm({
        title: "Confirm Logout",
        content: "Are you sure you want to log out?",
        onOk: async () => {
          await logout();
          navigate("/login");
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sider width={200} className="!bg-transparent">
      <Menu
        mode="inline"
        defaultSelectedKeys={[path]}
        items={[
          ...items,
          {
            key: "logout",
            icon: <LogOut size={20} />,
            label: "Log Out",
            onClick: handleLogout,
          },
        ]}
      />
    </Sider>
  );
};

export default MenuLeft;
