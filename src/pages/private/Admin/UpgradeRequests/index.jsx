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
  Alert,
  Tooltip
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
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter, appliedSearchText]);

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

      let requestsData = normalizeData(requestsResponse);
      
      // Filter by user name if appliedSearchText is provided
      if (appliedSearchText.trim()) {
        const searchLower = appliedSearchText.trim().toLowerCase();
        requestsData = requestsData.filter(request => {
          const fullName = `${request.user?.firstName || ''} ${request.user?.lastName || ''}`.trim().toLowerCase();
          const email = (request.user?.email || '').toLowerCase();
          return fullName.includes(searchLower) || email.includes(searchLower);
        });
      }
      
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
          <Tooltip title="View">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record._id)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Review">
              <Button
                type="default"
                size="small"
                icon={<FileTextOutlined />}
                onClick={() => handleReview(record)}
              />
            </Tooltip>
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
      {/* <style>
        {`
          .search-input-white .ant-input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          .search-input-white .ant-input {
            color: white !important;
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 8px !important;
          }
          .search-input-white .ant-input-search-button {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: white !important;
          }
          .search-input-white .ant-input-search-button:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
          }
        `}
      </style> */}
      {/* 🔹 Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <div
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              padding: '16px 20px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', fontWeight: 500 }}>
                  TOTAL REQUESTS
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>
                  {stats.total || 0}
                </div>
              </div>
              <FileTextOutlined style={{ fontSize: '36px', opacity: 0.3, position: 'absolute', top: '12px', right: '12px' }} />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
              borderRadius: '12px',
              padding: '16px 20px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', fontWeight: 500 }}>
                  PENDING
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>
                  {stats.pending || 0}
                </div>
              </div>
              <ClockCircleOutlined style={{ fontSize: '36px', opacity: 0.3, position: 'absolute', top: '12px', right: '12px' }} />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div
            style={{
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              borderRadius: '12px',
              padding: '16px 20px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '120px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', fontWeight: 500 }}>
                  APPROVED
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1' }}>
                  {(stats.breakdown || []).find(s => s._id === 'approved')?.count || 0}
                </div>
              </div>
              <CheckCircleOutlined style={{ fontSize: '36px', opacity: 0.3, position: 'absolute', top: '12px', right: '12px' }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* 🔹 Banner Header */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(240, 147, 251, 0.3)',
          padding: '20px 24px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="flex items-center justify-between"
      >
        <div style={{ position: 'relative', zIndex: 1 }} className="flex items-center">
          <div 
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <FileTextOutlined style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'white' }}>
              Upgrade Requests Management
            </h1>
            <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.9)' }}>
              Review and manage candidate upgrade requests
            </p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Space>
            <Input.Search
              placeholder="Search by user name or email"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (!e.target.value) {
                  setAppliedSearchText('');
                }
              }}
              onSearch={(value) => setAppliedSearchText(value)}
              allowClear
              enterButton
              className="search-input-white"
              style={{ 
                width: 300
              }}
            />
            <span style={{ color: 'white', fontWeight: 500 }}>Status:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by Status"
              allowClear
              style={{ 
                width: 160,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px'
              }}
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            <Button 
              type="default" 
              onClick={fetchData}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                borderRadius: '8px'
              }}
            >
              Refresh
            </Button>
          </Space>
        </div>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          zIndex: 0
        }}></div>
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
