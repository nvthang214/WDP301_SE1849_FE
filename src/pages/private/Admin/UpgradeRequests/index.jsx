import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Input, 
  message, 
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
import { 
  EyeOutlined, 
  CheckOutlined, 
  CloseOutlined,
  FileTextOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { UpgradeRequestService } from '../../../../services/UpgradeRequestService';

const { Option } = Select;
const { TextArea } = Input;

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
      message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
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
      message.error('Không thể tải chi tiết yêu cầu.');
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
      message.error('Vui lòng chọn trạng thái duyệt!');
      return;
    }

    try {
      await UpgradeRequestService.reviewUpgradeRequest(
        selectedRequest._id, 
        reviewStatus, 
        adminNote
      );
      
      const successMessage = reviewStatus === 'approved' 
        ? 'Yêu cầu đã được duyệt thành công! Người dùng đã được nâng cấp thành Recruiter và công ty đã được tạo tự động.'
        : 'Yêu cầu đã bị từ chối thành công!';
      
      message.success(successMessage);
      setIsReviewModalVisible(false);
      setSelectedRequest(null);
      setReviewStatus('');
      setAdminNote('');
      fetchData();
    } catch (error) {
      console.error('Error reviewing request:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ duyệt' },
      approved: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã duyệt' },
      rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Từ chối' },
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
      title: 'Người dùng',
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
      title: 'Công ty',
      dataIndex: ['companyInfo', 'name'],
      key: 'companyName',
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Ngành nghề',
      dataIndex: ['companyInfo', 'industry'],
      key: 'industry',
      render: (text) => text || 'Chưa cập nhật',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
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
            Xem
          </Button>
          {record.status === 'pending' && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleReview(record)}
            >
              Duyệt
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
    <div className="p-6">
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng yêu cầu"
              value={stats.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={(stats.breakdown || []).find(s => s._id === 'approved')?.count || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="mb-4">
          <Row justify="space-between" align="middle">
            <Col>
              <h1 className="text-2xl font-bold text-gray-800 mb-0">
                <FileTextOutlined className="mr-2" />
                Quản lý yêu cầu nâng cấp
              </h1>
            </Col>
            <Col>
              <Space>
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Lọc theo trạng thái"
                  allowClear
                  style={{ width: 150 }}
                >
                  <Option value="pending">Chờ duyệt</Option>
                  <Option value="approved">Đã duyệt</Option>
                  <Option value="rejected">Từ chối</Option>
                </Select>
                <Button onClick={fetchData}>
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={requests}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} yêu cầu`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết yêu cầu nâng cấp"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <Descriptions title="Thông tin người dùng" bordered column={1}>
              <Descriptions.Item label="Tên">
                {[selectedRequest.user?.firstName, selectedRequest.user?.lastName].filter(Boolean).join(' ')}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedRequest.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày gửi">
                {new Date(selectedRequest.createdAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Thông tin công ty" bordered column={1}>
              <Descriptions.Item label="Tên công ty">
                {selectedRequest.companyInfo?.name || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngành nghề">
                {selectedRequest.companyInfo?.industry || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedRequest.companyInfo?.address || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedRequest.companyInfo?.contact?.email || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedRequest.companyInfo?.contact?.phone || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                {selectedRequest.companyInfo?.contact?.website || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {selectedRequest.companyInfo?.description || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Phúc lợi">
                {selectedRequest.companyInfo?.benefits || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Tầm nhìn">
                {selectedRequest.companyInfo?.vision || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>

            {selectedRequest.businessLicense && (
              <div>
                <h4 className="font-medium mb-2">Giấy phép kinh doanh:</h4>
                <Image
                  src={`data:image/jpeg;base64,${selectedRequest.businessLicense}`}
                  alt="Business License"
                  style={{ maxWidth: '100%', maxHeight: 400 }}
                />
              </div>
            )}

            {selectedRequest.adminNote && (
              <Alert
                message="Ghi chú từ admin"
                description={selectedRequest.adminNote}
                type="info"
                showIcon
              />
            )}
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title="Duyệt yêu cầu nâng cấp"
        open={isReviewModalVisible}
        onOk={handleSubmitReview}
        onCancel={() => setIsReviewModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Thông tin yêu cầu</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Người dùng:</span> {[selectedRequest.user?.firstName, selectedRequest.user?.lastName].filter(Boolean).join(' ')}</p>
                <p><span className="font-medium">Email:</span> {selectedRequest.user?.email}</p>
                <p><span className="font-medium">Công ty:</span> {selectedRequest.companyInfo?.name || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Quyết định:
              </label>
              <Select
                value={reviewStatus}
                onChange={setReviewStatus}
                className="w-full"
                placeholder="Chọn quyết định"
              >
                <Option value="approved">
                  <div className="flex items-center">
                    <CheckOutlined className="text-green-500 mr-2" />
                    <span>Duyệt</span>
                  </div>
                </Option>
                <Option value="rejected">
                  <div className="flex items-center">
                    <CloseOutlined className="text-red-500 mr-2" />
                    <span>Từ chối</span>
                  </div>
                </Option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Ghi chú (tùy chọn):
              </label>
              <TextArea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={4}
                placeholder="Nhập ghi chú cho người dùng..."
              />
            </div>
            
            {reviewStatus === 'approved' && (
              <Alert
                message="Lưu ý"
                description="Khi duyệt, người dùng sẽ được nâng cấp thành Recruiter và có thể đăng nhập với vai trò mới."
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
