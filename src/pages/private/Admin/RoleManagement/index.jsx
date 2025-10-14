import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  message, 
  Spin, 
  Alert,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  CrownOutlined, 
  ReloadOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { AdminService } from '../../../../services/AdminService';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolesResponse, usersResponse] = await Promise.all([
        AdminService.getAllRoles(),
        AdminService.getAllUsers()
      ]);

      setRoles(rolesResponse.data || []);
      setUsers(usersResponse.data || []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate user count for each role
  const getRoleUserCount = (roleName) => {
    return users.filter(user => user.Role === roleName).length;
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'admin':
        return 'red';
      case 'recruiter':
        return 'blue';
      case 'user':
        return 'green';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Tag color={getRoleColor(text)} className="text-lg px-3 py-1">
          {text}
        </Tag>
      ),
    },
    {
      title: 'Số lượng người dùng',
      dataIndex: 'name',
      key: 'userCount',
      render: (roleName) => (
        <div className="flex items-center">
          <TeamOutlined className="mr-2 text-blue-500" />
          <span className="font-medium">{getRoleUserCount(roleName)} người dùng</span>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      key: 'description',
      render: (_, record) => {
        const descriptions = {
          'admin': 'Quản trị viên hệ thống - có toàn quyền truy cập',
          'recruiter': 'Nhà tuyển dụng - có thể đăng tin tuyển dụng',
          'user': 'Người dùng thường - có thể ứng tuyển việc làm',
          'guest': 'Khách - chỉ có thể xem thông tin cơ bản'
        };
        return (
          <span className="text-gray-600">
            {descriptions[record.name] || 'Vai trò trong hệ thống'}
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <Row justify="space-between" align="middle">
            <Col>
              <h1 className="text-2xl font-bold text-gray-800 mb-0">
                <CrownOutlined className="mr-2" />
                Quản lý vai trò
              </h1>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchData}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {roles.map(role => (
            <Col xs={24} sm={12} lg={6} key={role._id}>
              <Card size="small">
                <Statistic
                  title={role.name}
                  value={getRoleUserCount(role.name)}
                  prefix={<TeamOutlined />}
                  valueStyle={{ 
                    color: getRoleColor(role.name) === 'red' ? '#ff4d4f' : 
                           getRoleColor(role.name) === 'blue' ? '#1890ff' : 
                           getRoleColor(role.name) === 'green' ? '#52c41a' : '#666'
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="_id"
          pagination={false}
          className="mt-4"
        />
      </Card>

      {/* Information Card */}
      <Card title="Thông tin về vai trò" className="mt-6">
        <div className="space-y-3">
          <div className="flex items-start">
            <Tag color="red" className="mr-3 mt-1">admin</Tag>
            <div>
              <p className="font-medium mb-1">Quản trị viên</p>
              <p className="text-gray-600 text-sm">
                Có toàn quyền truy cập hệ thống, có thể quản lý người dùng, vai trò và các chức năng khác.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Tag color="blue" className="mr-3 mt-1">recruiter</Tag>
            <div>
              <p className="font-medium mb-1">Nhà tuyển dụng</p>
              <p className="text-gray-600 text-sm">
                Có thể đăng tin tuyển dụng, quản lý ứng viên và các hoạt động liên quan đến tuyển dụng.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Tag color="green" className="mr-3 mt-1">user</Tag>
            <div>
              <p className="font-medium mb-1">Người dùng</p>
              <p className="text-gray-600 text-sm">
                Có thể tìm kiếm việc làm, ứng tuyển và quản lý hồ sơ cá nhân.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Tag color="default" className="mr-3 mt-1">guest</Tag>
            <div>
              <p className="font-medium mb-1">Khách</p>
              <p className="text-gray-600 text-sm">
                Chỉ có thể xem thông tin cơ bản mà không cần đăng ký tài khoản.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoleManagement;
