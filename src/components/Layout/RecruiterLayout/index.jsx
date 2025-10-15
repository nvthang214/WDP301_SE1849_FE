import React, { useState } from "react";
import { Layout } from "antd";
import HeaderMain from "./Header";
import SidebarMain from "./Sidebar";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const LayoutDashboard = ({ title = "Dashboard", role = "recruiter", children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <SidebarMain role={role} />
      </Sider>

      {/* Header + Content */}
      <Layout>
        <HeaderMain collapsed={collapsed} onToggle={handleToggle} title={title} />
        <Content style={{ padding: 24, background: "#f9f9f9" }}>
          <div>{children || <Outlet />}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutDashboard;
