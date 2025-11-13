import React, { useState, useEffect } from "react";
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
  Statistic,
  Tooltip,
} from "antd";
import { notifySuccess, notifyError, notifyWarning } from "../../../../components/Notification";
import {
  UserOutlined,
  EditOutlined,
  StopOutlined,
  UnlockOutlined,
  SearchOutlined,
  TeamOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { AdminService } from "../../../../services/AdminService";
import useAuthStore from "../../../../store/useAuthStore";

const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userStats, setUserStats] = useState({ total: 0, active: 0, banned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // Input value for typing
  const [searchText, setSearchText] = useState(""); // Actual search value sent to API
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
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
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Track filters to detect changes
  const prevFiltersRef = React.useRef(`${searchText}|${roleFilter}|${statusFilter}`);

  // Fetch data when pagination, search, or filters change
  useEffect(() => {
    // Always reset to page 1 when filters change (not pagination)
    const filtersKey = `${searchText}|${roleFilter}|${statusFilter}`;
    if (filtersKey !== prevFiltersRef.current) {
      prevFiltersRef.current = filtersKey;
      if (pagination.current !== 1) {
        setPagination((prev) => ({ ...prev, current: 1 }));
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

      if (statusFilter !== "") {
        params.status = statusFilter;
      }

      const [usersResponse, rolesResponse, overviewStatsResponse] = await Promise.all([
        AdminService.getAllUsers(params),
        AdminService.getAllRoles(),
        AdminService.getOverviewStats(),
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
        setPagination((prev) => ({
          ...prev,
          total: usersPaginationData.total || 0,
        }));
      }

      setUsers(usersData);
      setRoles(rolesData);

      // Parse overview stats for user statistics
      const overviewStatsData = overviewStatsResponse?.data || overviewStatsResponse;
      setUserStats({
        total: overviewStatsData?.users?.total || 0,
        active: overviewStatsData?.users?.active || 0,
        banned: overviewStatsData?.users?.banned || 0
      });

    } catch (err) {
      console.error("Error fetching data:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError(
          "Session expired or insufficient permissions. Please log in again with an admin account."
        );
      } else {
        setError("Failed to load data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isActive) => {
    try {
      if (user && userId === user._id && isActive === false) {
        notifyWarning("You cannot ban your own account.");
        return;
      }
      await AdminService.banUser(userId, isActive);
      notifySuccess(isActive ? "User unbanned successfully!" : "User banned successfully!");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error banning user:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        notifyError(
          "Insufficient permissions or account is locked. Please log in again with an admin account."
        );
      } else {
        notifyError("An error occurred. Please try again.");
      }
    }
  };

  const handleUpdateRole = async () => {
    try {
      await AdminService.updateUserRole(selectedUser._id, selectedRoleId);
      notifySuccess("Role updated successfully!");
      setIsRoleModalVisible(false);
      setSelectedUser(null);
      setSelectedRoleId("");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error updating role:", err);
      notifyError("An error occurred. Please try again.");
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRoleId(user.role?._id || "");
    setIsRoleModalVisible(true);
  };

  const columns = [
    {
      title: "Full Name",
      key: "fullName",
      render: (_, record) => {
        const fullName = [record.firstName, record.lastName].filter(Boolean).join(" ");
        return (
          <div>
            <div className="font-medium">{fullName || "Not updated"}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        );
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <span className={text ? "text-gray-800" : "text-gray-400 italic"}>
          {text || "Not updated"}
        </span>
      ),
    },
    {
      title: "Current Role",
      key: "role",
      render: (_, record) => {
        const roleName = record.role?.name || "Undefined";
        const color =
          roleName === "admin"
            ? "red"
            : roleName === "recruiter"
              ? "blue"
              : roleName === "user"
                ? "green"
                : "default";
        return (
          <Tag color={color} className="font-medium">
            {roleName}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"} className="font-medium">
          {isActive ? "Active" : "Banned"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Change Role">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openRoleModal(record)}
              className="text-xs"
            />
          </Tooltip>

          {record.isActive ? (
            <Popconfirm
              title="Confirm Ban User"
              description={`Are you sure you want to ban user "${[record.firstName, record.lastName].filter(Boolean).join(" ") || record.email}"?`}
              onConfirm={() => handleBanUser(record._id, false)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Ban">
                <Button danger size="small" icon={<StopOutlined />} className="text-xs" />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Confirm Unban User"
              description={`Are you sure you want to unban user "${[record.firstName, record.lastName].filter(Boolean).join(" ") || record.email}"?`}
              onConfirm={() => handleBanUser(record._id, true)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Unban">
                <Button
                  size="small"
                  icon={<UnlockOutlined />}
                  className="text-xs"
                  style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#73d13d";
                    e.currentTarget.style.borderColor = "#73d13d";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#52c41a";
                    e.currentTarget.style.borderColor = "#52c41a";
                  }}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon className="mb-4" />;
  }

  return (
    <div className="m-0 p-0">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              padding: "16px 20px",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "120px",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <div>
                <div
                  style={{ fontSize: "12px", opacity: 0.9, marginBottom: "6px", fontWeight: 500 }}
                >
                  TOTAL USERS
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>
                  {userStats.total || 0}
                </div>
              </div>
              <UserOutlined
                style={{
                  fontSize: "36px",
                  opacity: 0.3,
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
              borderRadius: "12px",
              padding: "16px 20px",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "120px",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <div>
                <div
                  style={{ fontSize: "12px", opacity: 0.9, marginBottom: "6px", fontWeight: 500 }}
                >
                  ACTIVE
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>
                  {userStats.active || 0}
                </div>
              </div>
              <TeamOutlined
                style={{
                  fontSize: "36px",
                  opacity: 0.3,
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
              borderRadius: "12px",
              padding: "16px 20px",
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "120px",
            }}
          >
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <div>
                <div
                  style={{ fontSize: "12px", opacity: 0.9, marginBottom: "6px", fontWeight: 500 }}
                >
                  BANNED
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>
                  {userStats.banned || 0}
                </div>
              </div>
              <LockOutlined
                style={{
                  fontSize: "36px",
                  opacity: 0.3,
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* 🔹 Banner Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
          padding: "20px 24px",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden",
        }}
        className="flex items-center justify-between"
      >
        <div style={{ position: "relative", zIndex: 1 }} className="flex items-center">
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "16px",
              backdropFilter: "blur(10px)",
            }}
          >
            <UserOutlined style={{ fontSize: "28px", color: "white" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "white" }}>
              User Management
            </h1>
            <p style={{ fontSize: "14px", margin: "4px 0 0 0", color: "rgba(255, 255, 255, 0.9)" }}>
              Manage users, roles, and account status
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            zIndex: 0,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            zIndex: 0,
          }}
        ></div>
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
                  setPagination((prev) => ({ ...prev, current: 1 }));
                }}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            </Col>
            Role :
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
            Status :
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
                  setSearchInput("");
                  setSearchText("");
                  setRoleFilter("");
                  setStatusFilter("");
                  setPagination((prev) => ({ ...prev, current: 1 }));
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
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
            onShowSizeChange: (current, size) => {
              setPagination((prev) => ({
                ...prev,
                current: 1,
                pageSize: size,
              }));
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
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
          setSelectedRoleId("");
        }}
        okText="Update"
        cancelText="Cancel"
        width={500}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-medium text-gray-800">User Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(" ") ||
                    "Not updated"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {selectedUser.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedUser.phoneNumber || "Not updated"}
                </p>
                <p>
                  <span className="font-medium">Current Role:</span>{" "}
                  <Tag
                    color={
                      selectedUser.role?.name === "admin"
                        ? "red"
                        : selectedUser.role?.name === "recruiter"
                          ? "blue"
                          : "green"
                    }
                  >
                    {selectedUser.role?.name || "Undefined"}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select New Role:
              </label>
              <Select
                value={selectedRoleId}
                onChange={setSelectedRoleId}
                className="w-full"
                placeholder="Select new role"
                size="large"
              >
                {roles.map((role) => (
                  <Option key={role._id} value={role._id}>
                    <div className="flex items-center">
                      <Tag
                        color={
                          role.name === "admin"
                            ? "red"
                            : role.name === "recruiter"
                              ? "blue"
                              : "green"
                        }
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
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Changing the role will affect this user's access
                  permissions in the system.
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
