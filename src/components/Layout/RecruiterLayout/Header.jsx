import React from "react";
import { Layout, Button, Dropdown, Space, Badge } from "antd";
import {
       BellOutlined,
       GlobalOutlined,
       MenuFoldOutlined,
       MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderMain = ({ collapsed = false, onToggle = () => { }, title = "Dashboard" }) => {
       const languageMenu = {
              items: [
                     { key: "1", label: "🇺🇸 English" },
                     { key: "2", label: "🇻🇳 Vietnamese" },
              ],
       };

       return (
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
                     {/* Trái: nút toggle + tiêu đề */}
                     <Space>
                            <Button
                                   type="text"
                                   icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}

                            />
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{title}</h2>
                     </Space>

                     {/* Phải: ngôn ngữ + thông báo */}
                     <Space>
                            <Dropdown menu={languageMenu} placement="bottomRight">
                                   <Button icon={<GlobalOutlined />} />
                            </Dropdown>
                            <Badge dot>
                                   <Button type="text" icon={<BellOutlined />} />
                            </Badge>
                     </Space>
              </Header>
       );
};

export default HeaderMain;
