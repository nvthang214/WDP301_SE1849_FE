import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Select, 
  message, 
  Popconfirm,
  Card,
  Input,
  Row,
  Col,
  Spin,
  Alert,
  Statistic
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  StopOutlined, 
  UnlockOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { AdminService } from '../../../../services/AdminService';

const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Modal states
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter users based on search text
    if (searchText) {
      const filtered = users.filter(user => 
        user.FullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.Email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.Role?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchText, users]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, rolesResponse] = await Promise.all([
        AdminService.getAllUsers(),
        AdminService.getAllRoles()
      ]);

      setUsers(usersResponse.data || []);
      setRoles(rolesResponse.data || []);
      setFilteredUsers(usersResponse.data || []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isActive) => {
    try {
      await AdminService.banUser(userId, isActive);
      message.success(isActive ? 'Mở khóa người dùng thành công!' : 'Khóa người dùng thành công!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error banning user:', err);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleUpdateRole = async () => {
    try {
      await AdminService.updateUserRole(selectedUser._id, selectedRoleId);
      message.success('Cập nhật vai trò thành công!');
      setIsRoleModalVisible(false);
      setSelectedUser(null);
      setSelectedRoleId('');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error updating role:', err);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRoleId(user.role_id?._id || '');
    setIsRoleModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      render: (id) => (
        <span className="text-xs text-gray-500 font-mono">
          {id?.slice(-8)}
        </span>
      ),
    },
    {
      title: 'Tên đầy đủ',
      dataIndex: 'FullName',
      key: 'FullName',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text || 'Chưa cập nhật'}</div>
          <div className="text-xs text-gray-500">{record.Email}</div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (text) => (
        <span className={text ? 'text-gray-800' : 'text-gray-400 italic'}>
          {text || 'Chưa cập nhật'}
        </span>
      ),
    },
    {
      title: 'Vai trò hiện tại',
      dataIndex: 'Role',
      key: 'Role',
      render: (role, record) => {
        const roleName = role || record.role_id?.name || 'Chưa xác định';
        const color = roleName === 'admin' ? 'red' : 
                     roleName === 'recruiter' ? 'blue' : 
                     roleName === 'user' ? 'green' : 'default';
        return (
          <Tag color={color} className="font-medium">
            {roleName}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} className="font-medium">
          {isActive ? 'Hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openRoleModal(record)}
            className="text-xs"
          >
            Đổi vai trò
          </Button>
          
          {record.IsActive ? (
            <Popconfirm
              title="Xác nhận khóa người dùng"
              description={`Bạn có chắc chắn muốn khóa người dùng "${record.FullName || record.Email}"?`}
              onConfirm={() => handleBanUser(record._id, false)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
                size="small"
                icon={<StopOutlined />}
                className="text-xs"
              >
                Khóa
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Xác nhận mở khóa người dùng"
              description={`Bạn có chắc chắn muốn mở khóa người dùng "${record.FullName || record.Email}"?`}
              onConfirm={() => handleBanUser(record._id, true)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                size="small"
                icon={<UnlockOutlined />}
                className="text-xs"
              >
                Mở khóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
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
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={users.filter(user => user.IsActive).length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Bị khóa"
              value={users.filter(user => !user.IsActive).length}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="mb-4">
          <Row justify="space-between" align="middle">
            <Col>
              <h1 className="text-2xl font-bold text-gray-800 mb-0">
                <UserOutlined className="mr-2" />
                Quản lý người dùng
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

        <div className="mb-4">
          <Search
            placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
        />
      </Card>

      {/* Role Update Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="mr-2 text-blue-500" />
            <span>Cập nhật vai trò người dùng</span>
          </div>
        }
        open={isRoleModalVisible}
        onOk={handleUpdateRole}
        onCancel={() => {
          setIsRoleModalVisible(false);
          setSelectedUser(null);
          setSelectedRoleId('');
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        width={500}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Thông tin người dùng</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Tên:</span> {selectedUser.FullName || 'Chưa cập nhật'}</p>
                <p><span className="font-medium">Email:</span> {selectedUser.Email}</p>
                <p><span className="font-medium">Số điện thoại:</span> {selectedUser.phone_number || 'Chưa cập nhật'}</p>
                <p>
                  <span className="font-medium">Vai trò hiện tại:</span> 
                  <Tag color={selectedUser.Role === 'admin' ? 'red' : selectedUser.Role === 'recruiter' ? 'blue' : 'green'} className="ml-2">
                    {selectedUser.Role || selectedUser.role_id?.name || 'Chưa xác định'}
                  </Tag>
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Chọn vai trò mới:
              </label>
              <Select
                value={selectedRoleId}
                onChange={setSelectedRoleId}
                className="w-full"
                placeholder="Chọn vai trò mới"
                size="large"
              >
                {roles.map(role => (
                  <Option key={role._id} value={role._id}>
                    <div className="flex items-center">
                      <Tag 
                        color={role.name === 'admin' ? 'red' : role.name === 'recruiter' ? 'blue' : 'green'}
                        className="mr-2"
                      >
                        {role.name}
                      </Tag>
                      <span>{role.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
            
            {selectedRoleId && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Lưu ý:</strong> Thay đổi vai trò sẽ ảnh hưởng đến quyền truy cập của người dùng này trong hệ thống.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
