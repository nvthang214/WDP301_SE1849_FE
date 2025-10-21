import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { App, Layout, Menu, Modal } from "antd";
import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import "antd/dist/reset.css";
const { Sider } = Layout;

const MenuLeft = ({
  items = [
    {
      key: "/candidate/overview",
      icon: <PieChartOutlined />,
      label: "Overview",
    },
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Applied Jobs",
    },
  ],
}) => {
  const path = useLocation().pathname;
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    confirm("Xác nhận đăng xuất");
    await logout();
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
