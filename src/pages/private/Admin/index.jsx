import React from "react";
import { Card, Row, Col, Button, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CrownOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AdminMain = () => {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: "Dashboard",
      description: "Tổng quan hệ thống và quản lý người dùng",
      icon: <DashboardOutlined className="text-4xl text-blue-500" />,
      path: "/admin/dashboard",
      color: "border-blue-200 bg-blue-50 hover:bg-blue-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Chào mừng đến với Admin Panel</h1>
        <p className="text-lg text-gray-600">Quản lý hệ thống một cách hiệu quả và dễ dàng</p>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {adminFeatures.map((feature, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              className={`h-full cursor-pointer transition-all duration-300 ${feature.color}`}
              hoverable
              onClick={() => navigate(feature.path)}
            >
              <div className="text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="mb-4 text-gray-600">{feature.description}</p>
                <Button type="primary" icon={<ArrowRightOutlined />} className="w-full">
                  Truy cập
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-8">
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Hướng dẫn sử dụng</h2>
          <div className="mx-auto max-w-md">
            <div className="p-4">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <h4 className="mb-2 font-medium">Dashboard</h4>
              <p className="text-sm text-gray-600">
                Xem tổng quan hệ thống với các thống kê quan trọng và quản lý người dùng trực tiếp
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminMain;
