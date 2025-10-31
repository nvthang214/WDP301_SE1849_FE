import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
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
import { notifySuccess, notifyError } from '../../../../components/Notification';

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
      // If data is null, no action needed - user has no request
    } catch (error) {
      // Only log actual errors
      console.error('Error fetching upgrade request:', error);
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
      notifyError('Only PDF files or images are accepted!');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      notifyError('File must be smaller than 10MB!');
      return false;
    }

    return false; // Prevent auto upload
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      notifyError('Please upload a business license!');
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

      notifySuccess('Upgrade request submitted successfully! Admin will review and respond soon.');
      form.resetFields();
      setFileList([]);
      setLogoPreview('');
      setBannerPreview('');
      checkExistingRequest();

    } catch (error) {
      console.error('Error submitting request:', error);
      const errorMsg = error?.response?.data?.message || 'An error occurred. Please try again.';
      notifyError(errorMsg);
    } finally {
      setLoading(false);
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

  if (existingRequest) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center mb-6">
            <FileTextOutlined className="text-4xl text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">
              Upgrade Request to Recruiter
            </h1>
            <p className="text-gray-600 mt-2">
              You already have an upgrade request being processed
            </p>
          </div>

          <Descriptions title="Request Information" bordered column={1}>
            <Descriptions.Item label="Status">
              {getStatusTag(existingRequest.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Submitted Date">
              {new Date(existingRequest.createdAt).toLocaleDateString('en-US')}
            </Descriptions.Item>
            <Descriptions.Item label="Company Name">
              {existingRequest.companyInfo?.name || 'Not updated'}
            </Descriptions.Item>
            <Descriptions.Item label="Company Description">
              {existingRequest.companyInfo?.description || 'Not updated'}
            </Descriptions.Item>
            <Descriptions.Item label="Industry">
              {existingRequest.companyInfo?.industry || 'Not updated'}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {existingRequest.companyInfo?.address || 'Not updated'}
            </Descriptions.Item>
            {existingRequest.reviewedAt && (
              <Descriptions.Item label="Reviewed Date">
                {new Date(existingRequest.reviewedAt).toLocaleDateString('en-US')}
              </Descriptions.Item>
            )}
            {existingRequest.adminNote && (
              <Descriptions.Item label="Admin Note">
                {existingRequest.adminNote}
              </Descriptions.Item>
            )}
          </Descriptions>

          {existingRequest.status === 'approved' && (
            <Alert
              message="Congratulations!"
              description="Your upgrade request has been approved. You can now log in with the Recruiter role."
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
            Upgrade Request to Recruiter
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in company information to request an account upgrade to Recruiter
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-4xl mx-auto"
        >
          <Divider orientation="left">Company Information</Divider>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyName"
                label="Company Name *"
                rules={[{ required: true, message: 'Please enter company name!' }]}
              >
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyIndustry"
                label="Industry"
              >
                <Input placeholder="e.g. Information Technology, Finance..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="companyDescription"
            label="Company Description"
          >
            <TextArea
              rows={4}
              placeholder="Describe the company, business areas..."
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
                label="Address"
              >
                <Input placeholder="Company address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyEmail"
                label="Company Email"
              >
                <Input placeholder="contact@company.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyPhone"
                label="Phone Number"
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
            label="Benefits"
          >
            <TextArea
              rows={3}
              placeholder="Describe the benefits the company provides..."
            />
          </Form.Item>

          <Form.Item
            name="companyVision"
            label="Vision"
          >
            <TextArea
              rows={3}
              placeholder="Company vision and mission..."
            />
          </Form.Item>

          <Divider orientation="left">Documents</Divider>

          <Form.Item
            label="Business License *"
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
                Upload Business License
              </Button>
            </Upload>
            <div className="text-sm text-gray-500 mt-2">
              Accept PDF files or images, maximum 10MB
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
              Submit Upgrade Request
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CandidateRequestUpgrade;
