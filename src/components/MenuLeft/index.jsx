import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
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
            label: "Logout",
          },
        ]}
      />
    </Sider>
  );
};

export default MenuLeft;
