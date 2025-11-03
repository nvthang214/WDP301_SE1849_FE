import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  Menu,
  Avatar,
  Typography,
  Spin,
  message,
  Empty,
} from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ApplicationService } from '../../../../services/ApplicationService';
import { useLocation } from 'react-router-dom';
import { notifySuccess } from '../../../../components/Notification';
  DownOutlined,
} from "@ant-design/icons";
import { ApplicationService } from "../../../../services/ApplicationService";
import { useLocation } from "react-router-dom";

const { Content } = Layout;
const { Title } = Typography;

const allowedStatuses = [
  { value: 'pending', label: 'Đang chờ' },
  { value: 'shortlisted', label: 'Đã shortlist' },
  { value: 'interview', label: 'Phỏng vấn' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'hired', label: 'Đã nhận' },
];

const transitionMap = {
  pending: ['shortlisted', 'interview', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['hired', 'rejected'],
  hired: [],
  rejected: [],
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const location = useLocation();

  // Get jobId from URL params
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

      // Fetch all applications for the job
      const allApplicationsResponse = await ApplicationService.getApplicationsByJobId(jobId);
      const allApps = allApplicationsResponse.data || allApplicationsResponse || [];

      // Separate applications by status
      const regularApps = allApps.filter((app) => app.status !== "shortlisted");
      const shortlistedApps = allApps.filter((app) => app.status === "shortlisted");

      setApplications(regularApps);
      setShortlistedApplications(shortlistedApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      message.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await ApplicationService.updateApplicationStatus(applicationId, newStatus);
      message.success("Cập nhật trạng thái thành công");
      fetchApplications(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const sortMenu = (
    <Menu
      items={[
        { key: "newest", label: "Newest" },
        { key: "oldest", label: "Oldest" },
      ]}
    />
  );

  const columnMenu = (
    <Menu
      items={[
        { key: "edit", label: "Edit Column" },
        { key: "delete", label: "Delete" },
      ]}
    />
  );

  const ApplicationCard = ({ application, showShortlistButton = true }) => {
    const candidate = application.candidate;
    const appliedDate = new Date(application.createdAt).toLocaleDateString("vi-VN");

    const actionMenu = (
      <Menu
        items={[
          {
            key: "shortlist",
            label: "Shortlist",
            onClick: () => handleStatusUpdate(application._id, "shortlisted"),
            disabled: application.status === "shortlisted",
          },
          {
            key: "reject",
            label: "Reject",
            onClick: () => handleStatusUpdate(application._id, "rejected"),
            disabled: application.status === "rejected",
          },
          {
            key: "pending",
            label: "Mark as Pending",
            onClick: () => handleStatusUpdate(application._id, "pending"),
            disabled: application.status === "pending",
          },
        ]}
      />
    );

    return (
      <Card
        className="mb-6 rounded-2xl shadow-md transition-shadow duration-200 hover:shadow-lg"
        bodyStyle={{ padding: "16px 20px" }}
        actions={[
          <Button type="link" className="text-blue-600 hover:text-blue-800">
            Download CV
          </Button>,
          <Dropdown overlay={actionMenu} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>,
        ]}
      >
        <div className="mb-3 flex items-center">
          <Avatar
            src={candidate?.avatar}
            icon={<UserOutlined />}
            size={48}
            className="mr-4 border border-gray-200"
          />
          <div>
            <h4 className="text-base font-semibold">
              {candidate?.firstName} {candidate?.lastName}
            </h4>
            <p className="text-sm text-gray-500">{candidate?.email}</p>
          </div>
        </div>

        <ul className="mb-2 space-y-1 text-sm text-gray-600">
          <li>• Phone: {candidate?.phoneNumber || "N/A"}</li>
          <li>
            • Status:{" "}
            <span
              className={`font-medium ${
                application.status === "shortlisted"
                  ? "text-green-600"
                  : application.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {application.status}
            </span>
          </li>
          <li>• Applied: {appliedDate}</li>
        </ul>
      </Card>
    );
  };

  return (
    <Layout className="rounded-xl bg-white p-8 shadow-lg">
      <Content>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <div className="flex items-center gap-3">
            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[
                { value: 'all', label: 'Tất cả' },
                ...allowedStatuses,
              ]}
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
        ) : (
          /* Columns */
          <Row gutter={24}>
            {/* All Applications */}
            <Col span={12}>
              <Card
                title={`All Applications (${applications.length})`}
                className="rounded-2xl shadow-lg"
                headStyle={{ borderBottom: "none", paddingBottom: 0 }}
                bodyStyle={{ paddingTop: "16px" }}
              >
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                      showShortlistButton={true}
                    />
                  ))
                ) : (
                  <Empty description="Chưa có ứng viên nào apply cho job này" className="my-8" />
                )}
              </Card>
            </Col>

            {/* Shortlisted */}
            <Col span={12}>
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span>Shortlisted ({shortlistedApplications.length})</span>
                    <Dropdown overlay={columnMenu} placement="bottomRight">
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                }
                className="rounded-2xl shadow-lg"
                headStyle={{ borderBottom: "none", paddingBottom: 0 }}
                bodyStyle={{ paddingTop: "16px" }}
              >
                {shortlistedApplications.length > 0 ? (
                  shortlistedApplications.map((application) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                      showShortlistButton={false}
                    />
                  ))
                ) : (
                  <Empty description="Chưa có ứng viên nào được shortlist" className="my-8" />
                )}

                {/* Create New Column Button */}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  className="mt-4 h-16 w-full rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
                >
                  Create New Column
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default Applications;
