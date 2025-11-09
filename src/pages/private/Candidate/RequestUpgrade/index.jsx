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
  CloseCircleOutlined,
  FilePdfOutlined,
  EyeOutlined
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
  const [businessLicensePreview, setBusinessLicensePreview] = useState('');
  const [businessLicensePreviewType, setBusinessLicensePreviewType] = useState(''); // 'image' or 'pdf'

  useEffect(() => {
    checkExistingRequest();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (businessLicensePreview) {
        URL.revokeObjectURL(businessLicensePreview);
      }
    };
  }, [businessLicensePreview]);

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

  // Handle file upload for logo and banner (similar to CompanyEdit)
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB for better performance)
      if (file.size > 2 * 1024 * 1024) {
        notifyError('File size must be smaller than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        notifyError('Please select an image file');
        return;
      }

      // Compress and resize image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        // Set max dimensions
        const maxWidth = field === 'logo' ? 200 : 800;
        const maxHeight = field === 'logo' ? 200 : 400;
        
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
        
        // Update form and preview
        if (field === 'logo') {
          setLogoPreview(base64);
          form.setFieldsValue({ companyLogo: base64 });
        } else if (field === 'banner') {
          setBannerPreview(base64);
          form.setFieldsValue({ companyBanner: base64 });
        }
        
        // Clean up object URL after use
        URL.revokeObjectURL(objectUrl);
      };
      
      img.onerror = () => {
        notifyError('Error loading image. Please try again.');
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    // Revoke old preview URL if exists
    setBusinessLicensePreview((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return '';
    });
    setBusinessLicensePreviewType('');
    
    // Update file list
    setFileList(newFileList);
    
    // Create preview for the selected file
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj || newFileList[0];
      if (file) {
        const isPDF = file.type === 'application/pdf';
        const isImage = file.type.startsWith('image/');
        
        if (isPDF) {
          // For PDF, create object URL for preview
          const url = URL.createObjectURL(file);
          setBusinessLicensePreview(url);
          setBusinessLicensePreviewType('pdf');
        } else if (isImage) {
          // For images, create object URL for preview
          const url = URL.createObjectURL(file);
          setBusinessLicensePreview(url);
          setBusinessLicensePreviewType('image');
        }
      }
    }
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
      // Clean up preview URL
      if (businessLicensePreview) {
        URL.revokeObjectURL(businessLicensePreview);
      }
      setBusinessLicensePreview('');
      setBusinessLicensePreviewType('');
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
      <Card
        bordered={false}
        className="shadow-none bg-transparent border-none p-0"
        style={{
          boxShadow: 'none',
          background: 'transparent',
        }}
      >

        <div className="text-center mb-6 bg-blue-400 text-white py-6 rounded-lg shadow-md">
          <FileTextOutlined className="text-5xl mb-3" />
          <h1 className="text-3xl font-semibold">
            Upgrade Request to Recruiter
          </h1>
          <p className="mt-2 text-lg">
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

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyLogo"
                label="Company Logo"
              >
                <div className="space-y-3">
                  <Input
                    placeholder="Enter logo URL"
                    onChange={handleLogoUrlChange}
                  />
                  <div className="text-center text-sm text-gray-500">OR</div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="logo-upload-upgrade"
                    />
                    <label 
                      htmlFor="logo-upload-upgrade"
                      className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                    >
                      <span className="text-sm text-gray-600">Upload Logo (Max 2MB)</span>
                    </label>
                  </div>
                  {logoPreview && (
                    <div className="mt-2 text-center">
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
                      />
                      <p className="text-xs text-gray-500 mt-1">Logo Preview</p>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="companyBanner"
                label="Company Banner"
              >
                <div className="space-y-3">
                  <Input
                    placeholder="Enter banner URL"
                    onChange={handleBannerUrlChange}
                  />
                  <div className="text-center text-sm text-gray-500">OR</div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="banner-upload-upgrade"
                    />
                    <label 
                      htmlFor="banner-upload-upgrade"
                      className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer"
                    >
                      <span className="text-sm text-gray-600">Upload Banner (Max 2MB)</span>
                    </label>
                  </div>
                  {bannerPreview && (
                    <div className="mt-2">
                      <img 
                        src={bannerPreview} 
                        alt="Banner preview" 
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">Banner Preview</p>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>

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
            
            {/* Preview Section */}
            {businessLicensePreview && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <EyeOutlined className="text-blue-500" />
                  <span className="font-medium text-gray-700">Preview</span>
                </div>
                
                {businessLicensePreviewType === 'image' && (
                  <div className="flex justify-center">
                    <img
                      src={businessLicensePreview}
                      alt="Business License Preview"
                      className="max-w-full max-h-96 object-contain rounded border border-gray-300 shadow-sm"
                      onError={() => {
                        setBusinessLicensePreview('');
                        setBusinessLicensePreviewType('');
                      }}
                    />
                  </div>
                )}
                
                {businessLicensePreviewType === 'pdf' && (
                  <div className="flex flex-col items-center gap-3">
                    <FilePdfOutlined className="text-6xl text-red-500" />
                    <div className="text-center">
                      <p className="font-medium text-gray-700 mb-1">
                        {fileList[0]?.name || 'PDF Document'}
                      </p>
                      <a
                        href={businessLicensePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline flex items-center gap-1 justify-center"
                      >
                        <FileTextOutlined />
                        Open PDF in new tab
                      </a>
                    </div>
                    <iframe
                      src={businessLicensePreview}
                      className="w-full h-96 border border-gray-300 rounded shadow-sm"
                      title="Business License PDF Preview"
                    />
                  </div>
                )}
              </div>
            )}
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
