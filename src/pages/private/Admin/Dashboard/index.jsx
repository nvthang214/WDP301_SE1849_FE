import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Spin, 
  Alert, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Select, 
  Popconfirm,
  Input,
  Pagination
} from 'antd';
import { notifySuccess, notifyError } from '../../../../components/Notification';
import { 
  UserOutlined, 
  TeamOutlined, 
  CrownOutlined, 
  LockOutlined, 
  FileTextOutlined,
  EditOutlined,
  StopOutlined,
  UnlockOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { AdminService } from '../../../../services/AdminService';
import useAuthStore from '../../../../store/useAuthStore';

const { Option } = Select;
const { Search } = Input;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalJobs: 0,
    activeJobs: 0
  });
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [jobSearchText, setJobSearchText] = useState('');
  const { user } = useAuthStore();
  
  // Pagination states
  const [userPagination, setUserPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [jobPagination, setJobPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  // Modal states
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Available roles - sẽ được load từ API
  const [availableRoles, setAvailableRoles] = useState([]);

  // Track search to detect changes
  const prevUserSearchRef = React.useRef(searchText);
  const prevJobSearchRef = React.useRef(jobSearchText);
  
  // Fetch data when pagination or search changes
  useEffect(() => {
    // Reset to page 1 when user search changes
    if (searchText !== prevUserSearchRef.current) {
      prevUserSearchRef.current = searchText;
      if (userPagination.current !== 1) {
        setUserPagination(prev => ({ ...prev, current: 1 }));
        return; // fetchDashboardData will be called when current changes to 1
      }
    }
    
    // Reset to page 1 when job search changes
    if (jobSearchText !== prevJobSearchRef.current) {
      prevJobSearchRef.current = jobSearchText;
      if (jobPagination.current !== 1) {
        setJobPagination(prev => ({ ...prev, current: 1 }));
        return; // fetchDashboardData will be called when current changes to 1
      }
    }
    
    // Fetch data
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPagination.current, jobPagination.current, userPagination.pageSize, jobPagination.pageSize, searchText, jobSearchText]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users, jobs, and roles data with pagination
      const [usersResponse, jobsResponse, rolesResponse] = await Promise.all([
        AdminService.getAllUsers({
          page: userPagination.current,
          limit: userPagination.pageSize,
          search: searchText,
        }),
        AdminService.getAllJobs({
          page: jobPagination.current,
          limit: jobPagination.pageSize,
          search: jobSearchText,
        }),
        AdminService.getAllRoles()
      ]);

      const usersData = usersResponse?.data || [];
      const usersPaginationData = usersResponse?.pagination || {};
      const jobsData = jobsResponse?.data || [];
      const jobsPaginationData = jobsResponse?.pagination || {};
      const roles = rolesResponse?.data || [];

      // Update pagination states
      if (usersPaginationData.total !== undefined) {
        setUserPagination(prev => ({
          ...prev,
          total: usersPaginationData.total || 0,
        }));
      }
      
      if (jobsPaginationData.total !== undefined) {
        setJobPagination(prev => ({
          ...prev,
          total: jobsPaginationData.total || 0,
        }));
      }

      // Fetch stats separately (using overview stats endpoint)
      const statsResponse = await AdminService.getOverviewStats();
      const statsData = statsResponse?.data || {};
      
      setStats({
        totalUsers: statsData.users?.total || 0,
        activeUsers: statsData.users?.active || 0,
        bannedUsers: statsData.users?.banned || 0,
        totalJobs: statsData.jobs?.total || 0,
        activeJobs: statsData.jobs?.active || 0
      });

      setUsers(usersData);
      setJobs(jobsData);
      setAvailableRoles(roles);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isActive) => {
    try {
      await AdminService.banUser(userId, isActive);
      notifySuccess(isActive ? 'User unbanned successfully!' : 'User banned successfully!');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error banning user:', err);
      notifyError('An error occurred. Please try again.');
    }
  };

  const handleUpdateRole = async () => {
    try {
      await AdminService.updateUserRole(selectedUser._id, selectedRoleId);
      notifySuccess('Role updated successfully!');
      setIsRoleModalVisible(false);
      setSelectedUser(null);
      setSelectedRoleId('');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error updating role:', err);
      notifyError('An error occurred. Please try again.');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    // Sử dụng role._id thực từ database
    setSelectedRoleId(user.role?._id || '');
    setIsRoleModalVisible(true);
  };

  const handleToggleJobVisibility = async (jobId, isActive) => {
    try {
      await AdminService.toggleJobVisibility(jobId, isActive);
      notifySuccess(isActive ? 'Job shown successfully!' : 'Job hidden successfully!');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error toggling job visibility:', err);
      notifyError('An error occurred. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await AdminService.deleteJob(jobId);
      notifySuccess('Job deleted successfully!');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error deleting job:', err);
      notifyError('An error occurred. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'fullName',
      render: (text, record) => `${record.firstName || ''} ${record.lastName || ''}`.trim() || 'Not updated',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => {
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => text || 'Not updated',
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
              description={`Are you sure you want to ban user "${`${record.firstName || ''} ${record.lastName || ''}`.trim() || record.email}"?`}
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
                Ban User
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Confirm Unban User"
              description={`Are you sure you want to unban user "${`${record.firstName || ''} ${record.lastName || ''}`.trim() || record.email}"?`}
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
                Unban User
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const jobColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <div className="font-medium text-gray-800">
          {text}
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (company) => (
        <span className="text-blue-600 font-medium">
          {company?.name || 'Undefined'}
        </span>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text) => text || 'Undefined',
    },
    {
      title: 'Salary',
      dataIndex: 'minSalary',
      key: 'salary',
      render: (_, record) => {
        if (record.minSalary && record.maxSalary) {
          return (
            <span className="text-green-600 font-medium">
              ${record.minSalary.toLocaleString()} - ${record.maxSalary.toLocaleString()}
            </span>
          );
        }
        return 'Negotiable';
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} className="font-medium">
          {isActive ? 'Active' : 'Hidden'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          {record.isActive ? (
            <Popconfirm
              title="Confirm Hide Job"
              description={`Are you sure you want to hide job "${record.title}"?`}
              onConfirm={() => handleToggleJobVisibility(record._id, false)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                size="small"
                icon={<EyeInvisibleOutlined />}
                className="text-xs"
              >
                Hide
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Confirm Show Job"
              description={`Are you sure you want to show job "${record.title}"?`}
              onConfirm={() => handleToggleJobVisibility(record._id, true)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                className="text-xs"
              >
                Show
              </Button>
            </Popconfirm>
          )}
          
          <Popconfirm
            title="Confirm Delete Job"
            description={`Are you sure you want to delete job "${record.title}"? This action cannot be undone!`}
            onConfirm={() => handleDeleteJob(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="text-xs"
            >
              Delete
            </Button>
          </Popconfirm>
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats.activeUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Jobs"
              value={stats.totalJobs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Jobs"
              value={stats.activeJobs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* User Management Section */}
      <Card>
        <div className="mb-4">
          <Row justify="space-between" align="middle">
            <Col>
              <h2 className="text-xl font-bold text-gray-800 mb-0">
                User List
              </h2>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search users..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  onSearch={(value) => {
                    setSearchText(value);
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-64"
                />
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchDashboardData}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: userPagination.current,
            pageSize: userPagination.pageSize,
            total: userPagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} users`,
            onChange: (page, pageSize) => {
              setUserPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
            onShowSizeChange: (current, size) => {
              setUserPagination(prev => ({
                ...prev,
                current: 1,
                pageSize: size,
              }));
            },
          }}
        />
      </Card>

      {/* Job Management Section */}
      <Card className="mt-6">
        <div className="mb-4">
          <Row justify="space-between" align="middle">
            <Col>
              <h2 className="text-xl font-bold text-gray-800 mb-0">
                Job Management
              </h2>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search jobs..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  onSearch={(value) => {
                    setJobSearchText(value);
                  }}
                  onChange={(e) => setJobSearchText(e.target.value)}
                  className="w-64"
                />
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchDashboardData}
                >
                  Refresh
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={jobColumns}
          dataSource={jobs}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: jobPagination.current,
            pageSize: jobPagination.pageSize,
            total: jobPagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} jobs`,
            onChange: (page, pageSize) => {
              setJobPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
            onShowSizeChange: (current, size) => {
              setJobPagination(prev => ({
                ...prev,
                current: 1,
                pageSize: size,
              }));
            },
          }}
        />
      </Card>

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
                <p><span className="font-medium">Name:</span> {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ') || 'Not updated'}</p>
                <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedUser.phoneNumber || 'Not updated'}</p>
                <p>
                  <span className="font-medium">Current Role:</span> 
                  <Tag color={selectedUser.role?.name === 'admin' ? 'red' : selectedUser.role?.name === 'recruiter' ? 'blue' : 'green'} className="ml-2">
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
                {availableRoles.map(role => (
                  <Option key={role._id} value={role._id}>
                    <div className="flex items-center">
                      <Tag 
                        color={role.name === 'admin' ? 'red' : role.name === 'recruiter' ? 'blue' : role.name === 'user' ? 'green' : 'default'}
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

export default AdminDashboard;
