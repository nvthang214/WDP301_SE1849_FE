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
  message, 
  Popconfirm,
  Input
} from 'antd';
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [jobSearchText, setJobSearchText] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  // Modal states
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Available roles - sẽ được load từ API
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    fetchDashboardData();
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

  useEffect(() => {
    // Filter jobs based on search text
    if (jobSearchText) {
      const filtered = jobs.filter(job => 
        job.title?.toLowerCase().includes(jobSearchText.toLowerCase()) ||
        job.company_id?.name?.toLowerCase().includes(jobSearchText.toLowerCase()) ||
        job.location?.toLowerCase().includes(jobSearchText.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobSearchText, jobs]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users, jobs, and roles data
      const [usersResponse, jobsResponse, rolesResponse] = await Promise.all([
        AdminService.getAllUsers(),
        AdminService.getAllJobs(),
        AdminService.getAllRoles()
      ]);

      const usersData = usersResponse.data || [];
      const jobs = jobsResponse.data || [];
      const roles = rolesResponse.data || [];

      // Calculate statistics
      const activeUsers = usersData.filter(user => user.IsActive).length;
      const bannedUsers = usersData.filter(user => !user.IsActive).length;
      const activeJobs = jobs.filter(job => job.isActive).length;

      setStats({
        totalUsers: usersData.length,
        activeUsers,
        bannedUsers,
        totalJobs: jobs.length,
        activeJobs
      });

      setUsers(usersData);
      setFilteredUsers(usersData);
      setJobs(jobs);
      setFilteredJobs(jobs);
      setAvailableRoles(roles);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isActive) => {
    try {
      await AdminService.banUser(userId, isActive);
      message.success(isActive ? 'Mở khóa người dùng thành công!' : 'Khóa người dùng thành công!');
      fetchDashboardData(); // Refresh data
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
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error updating role:', err);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    // Sử dụng role_id thực từ database thay vì Role name
    setSelectedRoleId(user.role_id?._id || user.role_id || '');
    setIsRoleModalVisible(true);
  };

  const handleToggleJobVisibility = async (jobId, isActive) => {
    try {
      await AdminService.toggleJobVisibility(jobId, isActive);
      message.success(isActive ? 'Hiển thị công việc thành công!' : 'Ẩn công việc thành công!');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error toggling job visibility:', err);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await AdminService.deleteJob(jobId);
      message.success('Xóa công việc thành công!');
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error deleting job:', err);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'FullName',
      key: 'FullName',
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      render: (role, record) => {
        const roleName = record.role_id?.name || role || 'Chưa xác định';
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
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} className="font-medium">
          {isActive ? 'Đang hoạt động' : 'Đang bị ban'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
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
            Chỉnh sửa role
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
                Chỉnh sửa trạng thái
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
                Chỉnh sửa trạng thái
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const jobColumns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <div className="font-medium text-gray-800">
          {text}
        </div>
      ),
    },
    {
      title: 'Công ty',
      dataIndex: 'company_id',
      key: 'company_id',
      render: (company) => (
        <span className="text-blue-600 font-medium">
          {company?.name || 'Chưa xác định'}
        </span>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      render: (text) => text || 'Chưa xác định',
    },
    {
      title: 'Mức lương',
      dataIndex: 'salary_min',
      key: 'salary',
      render: (_, record) => {
        if (record.salary_min && record.salary_max) {
          return (
            <span className="text-green-600 font-medium">
              {record.salary_min.toLocaleString('vi-VN')} - {record.salary_max.toLocaleString('vi-VN')} VNĐ
            </span>
          );
        }
        return 'Thỏa thuận';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} className="font-medium">
          {isActive ? 'Đang hiển thị' : 'Đã ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          {record.isActive ? (
            <Popconfirm
              title="Xác nhận ẩn công việc"
              description={`Bạn có chắc chắn muốn ẩn công việc "${record.title}"?`}
              onConfirm={() => handleToggleJobVisibility(record._id, false)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                size="small"
                icon={<EyeInvisibleOutlined />}
                className="text-xs"
              >
                Ẩn
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Xác nhận hiển thị công việc"
              description={`Bạn có chắc chắn muốn hiển thị công việc "${record.title}"?`}
              onConfirm={() => handleToggleJobVisibility(record._id, true)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                className="text-xs"
              >
                Hiển thị
              </Button>
            </Popconfirm>
          )}
          
          <Popconfirm
            title="Xác nhận xóa công việc"
            description={`Bạn có chắc chắn muốn xóa công việc "${record.title}"? Hành động này không thể hoàn tác!`}
            onConfirm={() => handleDeleteJob(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="text-xs"
            >
              Xóa
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Số người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Số người còn hoạt động"
              value={stats.activeUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số công việc"
              value={stats.totalJobs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số công việc còn hoạt động"
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
                Danh sách người dùng
              </h2>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Search người dùng"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  onSearch={setSearchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-64"
                />
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchDashboardData}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
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

      {/* Job Management Section */}
      <Card className="mt-6">
        <div className="mb-4">
          <Row justify="space-between" align="middle">
            <Col>
              <h2 className="text-xl font-bold text-gray-800 mb-0">
                Quản lý công việc
              </h2>
            </Col>
            <Col>
              <Space>
                <Search
                  placeholder="Tìm kiếm công việc..."
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  onSearch={setJobSearchText}
                  onChange={(e) => setJobSearchText(e.target.value)}
                  className="w-64"
                />
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchDashboardData}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={jobColumns}
          dataSource={filteredJobs}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} công việc`,
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
                  <Tag color={selectedUser.role_id?.name === 'admin' ? 'red' : selectedUser.role_id?.name === 'recruiter' ? 'blue' : 'green'} className="ml-2">
                    {selectedUser.role_id?.name || selectedUser.Role || 'Chưa xác định'}
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

export default AdminDashboard;
