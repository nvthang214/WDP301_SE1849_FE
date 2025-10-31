import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Select,
  Popconfirm,
  Card,
  Input,
  Row,
  Col,
  Spin,
  Alert,
  Statistic
} from 'antd';
import { notifySuccess, notifyError, notifyWarning } from '../../../../components/Notification';
import {
  UserOutlined,
  EditOutlined,
  StopOutlined,
  UnlockOutlined,
  SearchOutlined,
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
  const [searchInput, setSearchInput] = useState(''); // Input value for typing
  const [searchText, setSearchText] = useState(''); // Actual search value sent to API
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuthStore();

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Track filters to detect changes
  const prevFiltersRef = React.useRef(`${searchText}|${roleFilter}|${statusFilter}`);

  // Fetch data when pagination, search, or filters change
  useEffect(() => {
    // Always reset to page 1 when filters change (not pagination)
    const filtersKey = `${searchText}|${roleFilter}|${statusFilter}`;
    if (filtersKey !== prevFiltersRef.current) {
      prevFiltersRef.current = filtersKey;
      if (pagination.current !== 1) {
        setPagination(prev => ({ ...prev, current: 1 }));
        return; // fetchData will be called when current changes to 1
      }
    }

    // Fetch data
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, searchText, roleFilter, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      if (roleFilter) {
        params.role = roleFilter;
      }

      if (statusFilter !== '') {
        params.status = statusFilter;
      }

      const [usersResponse, rolesResponse] = await Promise.all([
        AdminService.getAllUsers(params),
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
      const usersPaginationData = usersResponse?.pagination || {};

      // Update pagination
      if (usersPaginationData.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: usersPaginationData.total || 0,
        }));
      }

      setUsers(usersData);
      setRoles(rolesData);

    } catch (err) {
      console.error('Error fetching data:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Session expired or insufficient permissions. Please log in again with an admin account.');
      } else {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isActive) => {
    try {
      if (user && userId === user._id && isActive === false) {
        notifyWarning('You cannot ban your own account.');
        return;
      }
      await AdminService.banUser(userId, isActive);
      notifySuccess(isActive ? 'User unbanned successfully!' : 'User banned successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error banning user:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        notifyError('Insufficient permissions or account is locked. Please log in again with an admin account.');
      } else {
        notifyError('An error occurred. Please try again.');
      }
    }
  };

  const handleUpdateRole = async () => {
    try {
      await AdminService.updateUserRole(selectedUser._id, selectedRoleId);
      notifySuccess('Role updated successfully!');
      setIsRoleModalVisible(false);
      setSelectedUser(null);
      setSelectedRoleId('');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error updating role:', err);
      notifyError('An error occurred. Please try again.');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRoleId(user.role?._id || '');
    setIsRoleModalVisible(true);
  };

  const columns = [
    {
      title: 'Full Name',
      key: 'fullName',
      render: (_, record) => {
        const fullName = [record.firstName, record.lastName].filter(Boolean).join(' ');
        return (
          <div>
            <div className="font-medium">{fullName || 'Not updated'}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        );
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => (
        <span className={text ? 'text-gray-800' : 'text-gray-400 italic'}>
          {text || 'Not updated'}
        </span>
      ),
    },
    {
      title: 'Current Role',
      key: 'role',
      render: (_, record) => {
        const roleName = record.role?.name || 'Undefined';
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
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} className="font-medium">
          {isActive ? 'Active' : 'Banned'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
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
            Change Role
          </Button>

          {record.isActive ? (
            <Popconfirm
              title="Confirm Ban User"
              description={`Are you sure you want to ban user "${[record.firstName, record.lastName].filter(Boolean).join(' ') || record.email}"?`}
              onConfirm={() => handleBanUser(record._id, false)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                size="small"
                icon={<StopOutlined />}
                className="text-xs"
              >
                Ban
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Confirm Unban User"
              description={`Are you sure you want to unban user "${[record.firstName, record.lastName].filter(Boolean).join(' ') || record.email}"?`}
              onConfirm={() => handleBanUser(record._id, true)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                size="small"
                icon={<UnlockOutlined />}
                className="text-xs"
              >
                Unban
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
        message="Error"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  return (
    <div className="p-0 m-0">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Users</span>}
              value={users.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Active</span>}
              value={users.filter(user => user.isActive).length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Banned</span>}
              value={users.filter(user => !user.isActive).length}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 🔹 Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center mb-0">
          <UserOutlined className="mr-3 text-3xl text-white" />
          User Management
        </h1>
      </div>

      {/* 🔹 Filter + Table Section */}
      <div className="p-0">
        {/* Search & Filters */}
        <div className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search by name, email or role..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchInput}
                onSearch={(value) => {
                  setSearchText(value);
                  setPagination(prev => ({ ...prev, current: 1 }));
                }}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Filter by Role"
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

            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Filter by Status"
                allowClear
                size="large"
                className="w-full"
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Banned</Option>
              </Select>
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Button
                size="large"
                onClick={() => {
                  setSearchInput('');
                  setSearchText('');
                  setRoleFilter('');
                  setStatusFilter('');
                  setPagination(prev => ({ ...prev, current: 1 }));
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </div>

        {/* 🔹 Table with Clear Border */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          bordered
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
            onShowSizeChange: (current, size) => {
              setPagination(prev => ({
                ...prev,
                current: 1,
                pageSize: size,
              }));
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ['10', '20', '50', '100'],
            position: ['bottomRight'],
          }}
        />
      </div>

      {/* Role Update Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="mr-2 text-blue-500" />
            <span>Update User Role</span>
          </div>
        }
        open={isRoleModalVisible}
        onOk={handleUpdateRole}
        onCancel={() => {
          setIsRoleModalVisible(false);
          setSelectedUser(null);
          setSelectedRoleId('');
        }}
        okText="Update"
        cancelText="Cancel"
        width={500}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">User Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ') || 'Not updated'}
                </p>
                <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedUser.phoneNumber || 'Not updated'}</p>
                <p>
                  <span className="font-medium">Current Role:</span>{' '}
                  <Tag color={selectedUser.role?.name === 'admin' ? 'red' : selectedUser.role?.name === 'recruiter' ? 'blue' : 'green'}>
                    {selectedUser.role?.name || 'Undefined'}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Select New Role:
              </label>
              <Select
                value={selectedRoleId}
                onChange={setSelectedRoleId}
                className="w-full"
                placeholder="Select new role"
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
                  <strong>Note:</strong> Changing the role will affect this user's access permissions in the system.
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
