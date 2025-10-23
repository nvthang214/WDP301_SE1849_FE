import React, { useState, useEffect, useMemo } from 'react';
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
  ReloadOutlined,
  TeamOutlined,
  LockOutlined
} from '@ant-design/icons';
import { AdminService } from '../../../../services/AdminService';
import useAuthStore from '../../../../store/useAuthStore';

const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuthStore();
  
  // Modal states
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter users based on search text, role filter, and status filter
    let filtered = users;

    // Apply search filter
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      filtered = filtered.filter(user => {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const roleName = (user.role?.name || '').toLowerCase();
        return fullName.includes(q) || email.includes(q) || roleName.includes(q);
      });
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role?.name === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== '') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(user => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  }, [searchText, users, roleFilter, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersResponse, rolesResponse] = await Promise.all([
        AdminService.getAllUsers(),
        AdminService.getAllRoles(),
      ]);

      const normalize = (res) => {
        if (!res) return [];
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        if (Array.isArray(d?.users)) return d.users;
        if (Array.isArray(d?.roles)) return d.roles;
        if (Array.isArray(d?.items)) return d.items;
        return [];
      };

      const usersData = normalize(usersResponse);
      const rolesData = normalize(rolesResponse);

      setUsers(usersData);
      setRoles(rolesData);
      setFilteredUsers(usersData);

    } catch (err) {
      console.error('Error fetching data:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Phiên đăng nhập hết hạn hoặc không đủ quyền. Vui lòng đăng nhập lại bằng tài khoản admin.');
      } else {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isActive) => {
    try {
      if (user && userId === user._id && isActive === false) {
        message.warning('Bạn không thể tự khóa tài khoản của chính mình.');
        return;
      }
      await AdminService.banUser(userId, isActive);
      message.success(isActive ? 'Mở khóa người dùng thành công!' : 'Khóa người dùng thành công!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error banning user:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        message.error('Bạn không đủ quyền hoặc đã bị khóa. Đăng nhập lại bằng tài khoản admin.');
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
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
    setSelectedRoleId(user.role?._id || '');
    setIsRoleModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên đầy đủ',
      key: 'fullName',
      render: (_, record) => {
        const fullName = [record.firstName, record.lastName].filter(Boolean).join(' ');
        return (
          <div>
            <div className="font-medium">{fullName || 'Chưa cập nhật'}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        );
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => (
        <span className={text ? 'text-gray-800' : 'text-gray-400 italic'}>
          {text || 'Chưa cập nhật'}
        </span>
      ),
    },
    {
      title: 'Vai trò hiện tại',
      key: 'role',
      render: (_, record) => {
        const roleName = record.role?.name || 'Chưa xác định';
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
      dataIndex: 'isActive',
      key: 'isActive',
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
          
          {record.isActive ? (
            <Popconfirm
              title="Xác nhận khóa người dùng"
              description={`Bạn có chắc chắn muốn khóa người dùng "${[record.firstName, record.lastName].filter(Boolean).join(' ') || record.email}"?`}
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
              description={`Bạn có chắc chắn muốn mở khóa người dùng "${[record.firstName, record.lastName].filter(Boolean).join(' ') || record.email}"?`}
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
              value={users.filter(user => user.isActive).length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Bị khóa"
              value={users.filter(user => !user.isActive).length}
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
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Tìm kiếm theo tên, email hoặc vai trò..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={setSearchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </Col>
            Role:
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Lọc theo vai trò"
                allowClear
                size="large"
                className="w-full"
                value={roleFilter}
                onChange={setRoleFilter}
              >
                <Option value="admin">Admin</Option>
                <Option value="recruiter">Recruiter</Option>
                <Option value="candidate">Candidate</Option>
              </Select>
            </Col>
            Status:
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                size="large"
                className="w-full"
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Bị khóa</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                size="large"
                onClick={() => {
                  setSearchText('');
                  setRoleFilter('');
                  setStatusFilter('');
                }}
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </div>

        {/* Filter Results Summary */}
        {/* {(searchText || roleFilter || statusFilter) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-blue-700 font-medium">
                  Hiển thị {filteredUsers.length} trong tổng số {users.length} người dùng
                </span>
                {(searchText || roleFilter || statusFilter) && (
                  <span className="ml-2 text-blue-600 text-sm">
                    (Đã lọc theo: {[
                      searchText && `"${searchText}"`,
                      roleFilter && `vai trò: ${roleFilter}`,
                      statusFilter && `trạng thái: ${statusFilter === 'active' ? 'hoạt động' : 'bị khóa'}`
                    ].filter(Boolean).join(', ')})
                  </span>
                )}
              </div>
            </div>
          </div>
        )} */}

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
            pageSizeOptions: ['10', '20', '50', '100'],
            size: 'default',
            position: ['bottomRight'],
            showLessItems: true,
            responsive: true,
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
