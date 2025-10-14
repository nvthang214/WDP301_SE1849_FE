import React from "react";
import { Layout, Menu, Button, Dropdown, Badge, Space } from "antd";
import {
  BellOutlined,
  InstagramOutlined,
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import DashboardSidebar from "../LayoutSidebar/DashboardSidebar.jsx";

const { Header, Sider, Content } = Layout;

export default function DashboardHeader({ children }) {
  const [collapsed, setCollapsed] = React.useState(false);

  const handleToggle = () => setCollapsed(!collapsed);

  const languageMenu = (
    <Menu
      items={[
        { key: "1", label: "🇺🇸 English" },
        { key: "2", label: "🇻🇳 Vietnamese" },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleToggle}
        width={220}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            padding: "16px",
            fontWeight: 600,
            textAlign: "center",
            fontSize: 18,
          }}
        >
          {collapsed ? "JP" : "Jobpilot"}
        </div>
        <DashboardSidebar />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Menu */}
          <Space size="large" align="center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleToggle}
            />
            <Link to="/" style={{ fontSize: 16, fontWeight: 500 }}>
              <HomeOutlined /> Home
            </Link>
            <Link to="/find-candidate">Find Candidate</Link>
            <Link to="/dashboard">
              <AppstoreOutlined /> Dashboard
            </Link>
            <Link to="/my-jobs">My Jobs</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/support">Customer Support</Link>
          </Space>

          {/* Right Menu */}
          <Space size="middle" align="center">
            <Space>
              <PhoneOutlined />
              <span>+1-202-555-0178</span>
            </Space>

            <Dropdown overlay={languageMenu} placement="bottomRight">
              <Button icon={<GlobalOutlined />} />
            </Dropdown>

            <Badge dot>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>

            <Button type="primary">Post A Job</Button>

            <Button
              shape="circle"
              icon={<InstagramOutlined />}
              style={{
                background:
                  "linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                color: "#fff",
                border: "none",
              }}
            />
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ padding: 24, background: "#f9f9f9" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
