import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { 
  DashboardOutlined,
  UserOutlined,
  CrownOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdminMain = () => {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: 'Dashboard',
      description: 'Tổng quan hệ thống và quản lý người dùng',
      icon: <DashboardOutlined className="text-4xl text-blue-500" />,
      path: '/admin/dashboard',
      color: 'border-blue-200 bg-blue-50 hover:bg-blue-100'
    }
  ];

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Chào mừng đến với Admin Panel
        </h1>
        <p className="text-gray-600 text-lg">
          Quản lý hệ thống một cách hiệu quả và dễ dàng
        </p>
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
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <Button 
                  type="primary" 
                  icon={<ArrowRightOutlined />}
                  className="w-full"
                >
                  Truy cập
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Hướng dẫn sử dụng
          </h2>
          <div className="max-w-md mx-auto">
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Dashboard</h4>
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
