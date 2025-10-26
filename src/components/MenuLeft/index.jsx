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
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuClick = ({ key }) => {
    // Tìm item được click
    const clickedItem = items.find(item => item.key === key);
    
    // Nếu item có onClick custom, sử dụng nó
    if (clickedItem && clickedItem.onClick) {
      clickedItem.onClick({ key });
    } 
    // Nếu không có onClick custom và key là một route path, navigate đến đó
    else if (key && key.startsWith('/')) {
      navigate(key);
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
