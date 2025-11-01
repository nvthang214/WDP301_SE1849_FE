import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Descriptions,
  Image,
  Spin,
  Alert
} from 'antd';
import { notifySuccess, notifyError } from '../../../../components/Notification';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { UpgradeRequestService } from '../../../../services/UpgradeRequestService';

const { Option } = Select;
const { TextArea } = Input;

// Helper function to detect if base64 string is a PDF
const isPDF = (base64String) => {
  try {
    // Decode base64 to binary string
    const binaryString = atob(base64String);
    // Check first bytes - PDF files start with %PDF
    return binaryString.substring(0, 4) === '%PDF';
  } catch (error) {
    return false;
  }
};

// Component to render business license (PDF or Image)
const BusinessLicenseViewer = ({ base64String }) => {
  if (!base64String) return null;

  const isPDFFile = isPDF(base64String);
  const base64Data = base64String; // Already just base64, no need to prepend

  if (isPDFFile) {
    // Render PDF
    const pdfDataUri = `data:application/pdf;base64,${base64Data}`;
    return (
      <div>
        <div className="mb-2 flex items-center">
          <FilePdfOutlined className="mr-2 text-red-500" />
          <span className="font-medium">PDF Document</span>
        </div>
        <iframe
          src={pdfDataUri}
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px'
          }}
          title="Business License PDF"
        />
        <div className="mt-2">
          <a
            href={pdfDataUri}
            download="business-license.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button icon={<FilePdfOutlined />} type="link">
              Download PDF
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Render Image
  return (
    <Image
      src={`data:image/jpeg;base64,${base64Data}`}
      alt="Business License"
      style={{ maxWidth: '100%', maxHeight: 400 }}
      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYynMP2H/XrFBw8BJ0GBOrtLLUNiUAJ2JQODqVUhFoaNYDOvxXYTBoMDAH8f0ktNaRgYEVXsDDCy4lFiXAHMH1jK4NWNgPAxkB8KJHgJ"
    />
  );
};

const AdminUpgradeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsResponse, statsResponse] = await Promise.all([
        UpgradeRequestService.getAllUpgradeRequests(statusFilter),
        UpgradeRequestService.getUpgradeRequestStats()
      ]);

      // Handle different response structures
      const normalizeData = (response) => {
        if (!response) return [];
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.requests)) return data.requests;
        return [];
      };

      const requestsData = normalizeData(requestsResponse);
      const statsData = statsResponse?.data?.data || statsResponse?.data || {};

      setRequests(requestsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      notifyError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (requestId) => {
    try {
      const response = await UpgradeRequestService.getUpgradeRequestById(requestId);

      const requestData = response?.data?.data || response?.data || response;
      setSelectedRequest(requestData);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching request details:', error);
      notifyError('Failed to load request details.');
    }
  };

  const handleReview = (request) => {
    setSelectedRequest(request);
    setReviewStatus('');
    setAdminNote('');
    setIsReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewStatus) {
      notifyError('Please select a review status!');
      return;
    }

    try {
      await UpgradeRequestService.reviewUpgradeRequest(
        selectedRequest._id,
        reviewStatus,
        adminNote
      );

      const successMessage = reviewStatus === 'approved'
        ? 'Request approved successfully! User has been upgraded to Recruiter and company has been created automatically.'
        : 'Request rejected successfully!';

      notifySuccess(successMessage);
      setIsReviewModalVisible(false);
      setSelectedRequest(null);
      setReviewStatus('');
      setAdminNote('');
      fetchData();
    } catch (error) {
      console.error('Error reviewing request:', error);
      notifyError('An error occurred. Please try again.');
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending' },
      approved: { color: 'green', icon: <CheckCircleOutlined />, text: 'Approved' },
      rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Rejected' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {[record.user?.firstName, record.user?.lastName].filter(Boolean).join(' ')}
          </div>
          <div className="text-xs text-gray-500">{record.user?.email}</div>
        </div>
      ),
    },
    {
      title: 'Company',
      dataIndex: ['companyInfo', 'name'],
      key: 'companyName',
      render: (text) => text || 'Not updated',
    },
    {
      title: 'Industry',
      dataIndex: ['companyInfo', 'industry'],
      key: 'industry',
      render: (text) => text || 'Not updated',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Submitted Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('en-US'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record._id)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleReview(record)}
            >
              Review
            </Button>
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

  return (
    <div className="p-0 m-0">
      {/* 🔹 Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Requests</span>}
              value={stats.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Pending</span>}
              value={stats.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Approved</span>}
              value={(stats.breakdown || []).find(s => s._id === 'approved')?.count || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 🔹 Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center mb-0">
          <FileTextOutlined className="mr-3 text-3xl text-white" />
          Upgrade Requests Management
        </h1>
        <div>
          Status : 
          <Space>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by Status"
              allowClear
              style={{ width: 160 }}
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <Button type="default" onClick={fetchData}>
              Refresh
            </Button>
          </Space>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="p-0">
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          bordered
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} requests`,
          }}
        />
      </div>

      {/* 🔹 Detail Modal */}
      <Modal
        title="Upgrade Request Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <Descriptions title="User Information" bordered column={1}>
              <Descriptions.Item label="Name">
                {[selectedRequest.user?.firstName, selectedRequest.user?.lastName]
                  .filter(Boolean)
                  .join(' ')}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedRequest.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Submitted Date">
                {new Date(selectedRequest.createdAt).toLocaleDateString('en-US')}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Company Information" bordered column={1}>
              <Descriptions.Item label="Company Name">
                {selectedRequest.companyInfo?.name || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Industry">
                {selectedRequest.companyInfo?.industry || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedRequest.companyInfo?.address || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.companyInfo?.contact?.email || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedRequest.companyInfo?.contact?.phone || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                {selectedRequest.companyInfo?.contact?.website || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedRequest.companyInfo?.description || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Benefits">
                {selectedRequest.companyInfo?.benefits || 'Not updated'}
              </Descriptions.Item>
              <Descriptions.Item label="Vision">
                {selectedRequest.companyInfo?.vision || 'Not updated'}
              </Descriptions.Item>
            </Descriptions>

            {selectedRequest.businessLicense && (
              <div>
                <h4 className="font-medium mb-2">Business License:</h4>
                <BusinessLicenseViewer base64String={selectedRequest.businessLicense} />
              </div>
            )}

            {selectedRequest.adminNote && (
              <Alert
                message="Admin Note"
                description={selectedRequest.adminNote}
                type="info"
                showIcon
              />
            )}
          </div>
        )}
      </Modal>

      {/* 🔹 Review Modal */}
      <Modal
        title="Review Upgrade Request"
        open={isReviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => setIsReviewModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Request Information</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">User:</span>{' '}
                  {[selectedRequest.user?.firstName, selectedRequest.user?.lastName]
                    .filter(Boolean)
                    .join(' ')}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {selectedRequest.user?.email}
                </p>
                <p>
                  <span className="font-medium">Company:</span>{' '}
                  {selectedRequest.companyInfo?.name || 'Not updated'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Decision:
              </label>
              <Select
                value={reviewStatus}
                onChange={setReviewStatus}
                className="w-full"
                placeholder="Select decision"
              >
                <Option value="approved">
                  <div className="flex items-center">
                    <CheckOutlined className="text-green-500 mr-2" />
                    <span>Approve</span>
                  </div>
                </Option>
                <Option value="rejected">
                  <div className="flex items-center">
                    <CloseOutlined className="text-red-500 mr-2" />
                    <span>Reject</span>
                  </div>
                </Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Note (optional):
              </label>
              <TextArea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                placeholder="Enter a note for the user..."
              />
            </div>

            {reviewStatus === 'approved' && (
              <Alert
                message="Note"
                description="When approved, the user will be upgraded to Recruiter and can log in with the new role."
                type="info"
                showIcon
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );

};

export default AdminUpgradeRequests;
