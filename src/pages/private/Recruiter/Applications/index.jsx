import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Button,
  Dropdown,
  Menu,
  Avatar,
  Typography,
  Spin,
  Empty,
  Table,
  Select,
} from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ApplicationService } from "../../../../services/ApplicationService";
import { useLocation } from "react-router-dom";
import { notifySuccess } from "../../../../components/Notification";

const { Content } = Layout;
const { Title } = Typography;

const allowedStatuses = [
  { value: "pending", label: "Đang chờ" },
  { value: "shortlisted", label: "Đã shortlist" },
  { value: "interview", label: "Phỏng vấn" },
  { value: "rejected", label: "Từ chối" },
  { value: "hired", label: "Đã nhận" },
];

const transitionMap = {
  pending: ["shortlisted", "interview", "rejected"],
  shortlisted: ["interview", "rejected"],
  interview: ["hired", "rejected"],
  hired: [],
  rejected: [],
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const location = useLocation();

  // Lấy jobId từ query string
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get("jobId");

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const allApplicationsResponse = await ApplicationService.getApplicationsByJobId(jobId);
      const allApps = allApplicationsResponse.data || allApplicationsResponse || [];
      const regularApps = allApps.filter((app) => app.status !== "shortlisted");
      const shortlistedApps = allApps.filter((app) => app.status === "shortlisted");
      setApplications(regularApps);
      setShortlistedApplications(shortlistedApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      // Lỗi đã được hiển thị bởi hệ thống notify trong axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await ApplicationService.updateApplicationStatus(applicationId, newStatus);
      notifySuccess("Cập nhật trạng thái thành công");
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
      // Lỗi đã được hiển thị bởi hệ thống notify trong axios interceptor
    }
  };

  const sortMenu = (
    <Menu
      items={[
        { key: "newest", label: "Mới nhất" },
        { key: "oldest", label: "Cũ nhất" },
      ]}
      onClick={({ key }) => setSortOrder(key)}
    />
  );

  const dataSource = useMemo(() => {
    const all = [...shortlistedApplications, ...applications];
    const filtered = filterStatus === "all" ? all : all.filter((a) => a.status === filterStatus);
    const sorted = [...filtered].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
    return sorted;
  }, [applications, shortlistedApplications, filterStatus, sortOrder]);

  const columns = [
    {
      title: "Ứng viên",
      dataIndex: "candidate",
      key: "candidate",
      render: (candidate) => (
        <div className="flex items-center">
          <Avatar src={candidate?.avatar} icon={<UserOutlined />} size={40} className="mr-3" />
          <div>
            <div className="font-semibold">
              {candidate?.firstName} {candidate?.lastName}
            </div>
            <div className="text-sm text-gray-500">{candidate?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "SĐT",
      dataIndex: ["candidate", "phoneNumber"],
      key: "phoneNumber",
      render: (phone) => phone || "N/A",
    },
    {
      title: "CV",
      dataIndex: "resume",
      key: "resume",
      render: (resume) =>
        resume ? (
          <a href={resume} target="_blank" rel="noreferrer" className="text-blue-600">
            Xem CV
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const current = String(status).toLowerCase();
        const nextAllowed = transitionMap[current] || [];
        const isTerminal = ["hired", "rejected"].includes(current);
        const optionsForRecord = allowedStatuses.map((opt) => ({
          ...opt,
          disabled: isTerminal || opt.value === current || !nextAllowed.includes(opt.value),
        }));

        return (
          <Select
            size="small"
            value={current}
            onChange={(val) => handleStatusUpdate(record._id, val)}
            options={optionsForRecord}
            style={{ minWidth: 160 }}
            disabled={isTerminal}
          />
        );
      },
    },
    {
      title: "Ngày nộp",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <Layout className="rounded-xl bg-white p-8 shadow-lg">
      <Content>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <div className="flex items-center gap-3">
            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[{ value: "all", label: "Tất cả" }, ...allowedStatuses]}
              size="middle"
              style={{ minWidth: 160 }}
              suffixIcon={<FilterOutlined />}
            />
            <Dropdown overlay={sortMenu} placement="bottomRight">
              <Button icon={<SortAscendingOutlined />}>Sắp xếp</Button>
            </Dropdown>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin size="large" />
          </div>
        ) : dataSource.length === 0 ? (
          <Empty description="Chưa có ứng viên nào apply cho job này" className="my-8" />
        ) : (
          <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Content>
    </Layout>
  );
};

export default Applications;
