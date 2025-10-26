import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Spin,
  Alert,
  Row,
  Col,
  Divider,
  Tag,
  Descriptions
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { UpgradeRequestService } from '../../../../services/UpgradeRequestService';

const { TextArea } = Input;

const CandidateRequestUpgrade = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  useEffect(() => {
    checkExistingRequest();
  }, []);

  // Compress image URL to shorter base64
  const compressImageUrl = (url) => {
    if (!url || url.startsWith('data:')) return url;

    // For external URLs, we'll just return them as-is
    // In production, you might want to proxy through your backend
    return url;
  };

  const checkExistingRequest = async () => {
    try {
      const response = await UpgradeRequestService.getMyUpgradeRequest();
      if (response?.data?.data) {
        setExistingRequest(response.data.data);
      }
    } catch (error) {
      // No existing request - this is normal
      console.log('No existing request found');
    }
  };

  // Handle logo/banner URL changes
  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    setLogoPreview(url);
    form.setFieldsValue({ companyLogo: compressImageUrl(url) });
  };

  const handleBannerUrlChange = (e) => {
    const url = e.target.value;
    setBannerPreview(url);
    form.setFieldsValue({ companyBanner: compressImageUrl(url) });
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isPDF = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isPDF && !isImage) {
      message.error('Chỉ chấp nhận file PDF hoặc hình ảnh!');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('File phải nhỏ hơn 10MB!');
      return false;
    }

    return false; // Prevent auto upload
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error('Vui lòng tải lên giấy phép kinh doanh!');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // Add company info with simple field names (backend expects these)
      formData.append('companyName', values.companyName);
      formData.append('companyDescription', values.companyDescription || '');
      formData.append('companyLogo', values.companyLogo || '');
      formData.append('companyBanner', values.companyBanner || '');
      formData.append('companyBenefits', values.companyBenefits || '');
      formData.append('companyVision', values.companyVision || '');
      formData.append('companyIndustry', values.companyIndustry || '');
      formData.append('companyAddress', values.companyAddress || '');
      formData.append('companyEmail', values.companyEmail || '');
      formData.append('companyPhone', values.companyPhone || '');
      formData.append('companyWebsite', values.companyWebsite || '');

      // Add business license file
      formData.append('businessLicense', fileList[0].originFileObj);

      await UpgradeRequestService.createUpgradeRequest(formData);

      message.success({
        content: 'Đơn yêu cầu nâng cấp đã được gửi thành công! Admin sẽ xem xét và phản hồi trong thời gian sớm nhất.',
        duration: 5,
      });
      form.resetFields();
      setFileList([]);
      setLogoPreview('');
      setBannerPreview('');
      checkExistingRequest();

    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Đang chờ duyệt' },
      approved: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã duyệt' },
      rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Bị từ chối' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  if (existingRequest) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center mb-6">
            <FileTextOutlined className="text-4xl text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">
              Yêu cầu nâng cấp thành Recruiter
            </h1>
            <p className="text-gray-600 mt-2">
              Bạn đã có một yêu cầu nâng cấp đang được xử lý
            </p>
          </div>

          <Descriptions title="Thông tin yêu cầu" bordered column={1}>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(existingRequest.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày gửi">
              {new Date(existingRequest.createdAt).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Tên công ty">
              {existingRequest.companyInfo?.name || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả công ty">
              {existingRequest.companyInfo?.description || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngành nghề">
              {existingRequest.companyInfo?.industry || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {existingRequest.companyInfo?.address || 'Chưa cập nhật'}
            </Descriptions.Item>
            {existingRequest.reviewedAt && (
              <Descriptions.Item label="Ngày duyệt">
                {new Date(existingRequest.reviewedAt).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            )}
            {existingRequest.adminNote && (
              <Descriptions.Item label="Ghi chú từ admin">
                {existingRequest.adminNote}
              </Descriptions.Item>
            )}
          </Descriptions>

          {existingRequest.status === 'approved' && (
            <Alert
              message="Chúc mừng!"
              description="Yêu cầu nâng cấp của bạn đã được duyệt. Bạn giờ đây có thể đăng nhập với vai trò Recruiter."
              type="success"
              showIcon
              className="mt-6"
            />
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="text-center mb-6">
          <FileTextOutlined className="text-4xl text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">
            Yêu cầu nâng cấp thành Recruiter
          </h1>
          <p className="text-gray-600 mt-2">
            Điền thông tin công ty để yêu cầu nâng cấp tài khoản thành Recruiter
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-4xl mx-auto"
        >
          <Divider orientation="left">Thông tin công ty</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyName"
                label="Tên công ty *"
                rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyIndustry"
                label="Ngành nghề"
              >
                <Input placeholder="Ví dụ: Công nghệ thông tin, Tài chính..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="companyDescription"
            label="Mô tả công ty"
          >
            <TextArea
              rows={4}
              placeholder="Mô tả về công ty, lĩnh vực hoạt động..."
            />
          </Form.Item>

          {/* <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyLogo"
                label="Logo công ty"
              >
                <Input
                  placeholder="URL logo công ty"
                  onChange={handleLogoUrlChange}
                />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-cover rounded border"
                      onError={() => setLogoPreview('')}
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyBanner"
                label="Banner công ty"
              >
                <Input
                  placeholder="URL banner công ty"
                  onChange={handleBannerUrlChange}
                />
                {bannerPreview && (
                  <div className="mt-2">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-20 object-cover rounded border"
                      onError={() => setBannerPreview('')}
                    />
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row> */}

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyAddress"
                label="Địa chỉ"
              >
                <Input placeholder="Địa chỉ công ty" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyEmail"
                label="Email công ty"
              >
                <Input placeholder="contact@company.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyPhone"
                label="Số điện thoại"
              >
                <Input placeholder="0123456789" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyWebsite"
                label="Website"
              >
                <Input placeholder="https://company.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="companyBenefits"
            label="Phúc lợi"
          >
            <TextArea
              rows={3}
              placeholder="Mô tả các phúc lợi mà công ty cung cấp..."
            />
          </Form.Item>

          <Form.Item
            name="companyVision"
            label="Tầm nhìn"
          >
            <TextArea
              rows={3}
              placeholder="Tầm nhìn và sứ mệnh của công ty..."
            />
          </Form.Item>

          <Divider orientation="left">Tài liệu</Divider>

          <Form.Item
            label="Giấy phép kinh doanh *"
            required
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept=".pdf,.jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />}>
                Tải lên giấy phép kinh doanh
              </Button>
            </Upload>
            <div className="text-sm text-gray-500 mt-2">
              Chấp nhận file PDF hoặc hình ảnh, tối đa 10MB
            </div>
          </Form.Item>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<FileTextOutlined />}
            >
              Gửi yêu cầu nâng cấp
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CandidateRequestUpgrade;
