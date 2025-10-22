import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Space,
  message,
  Spin
} from 'antd';
import {
  UploadOutlined,
  PictureOutlined,
  SaveOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { CompanyService } from '../../../../services/CompanyService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CompanyInfo = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  // Get user ID from localStorage or token
  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id;
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    return localStorage.getItem('userId');
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await CompanyService.getCompanyByRecruiter();
      if (response.isOk && response.data) {
        setCompanyData(response.data);
        form.setFieldsValue({
          name: response.data.name,
          description: response.data.description
        });
        setLogo(response.data.logo);
        setBanner(response.data.banner);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      message.error('Failed to load company information');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const url = info.file.response?.data?.url || URL.createObjectURL(info.file.originFileObj);
      setLogo(url);
      message.success('Logo uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Logo upload failed');
    }
  };

  const handleBannerUpload = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const url = info.file.response?.data?.url || URL.createObjectURL(info.file.originFileObj);
      setBanner(url);
      message.success('Banner uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Banner upload failed');
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      const companyInfo = {
        ...values,
        logo,
        banner,
        recruiter: getUserId()
      };

      let response;
      if (companyData) {
        response = await CompanyService.updateCompany(companyData._id, companyInfo);
      } else {
        response = await CompanyService.createCompany(companyInfo);
      }

      if (response.isOk) {
        message.success('Company information saved successfully!');
        setCompanyData(response.data);
      } else {
        message.error(response.msg || 'Failed to save company information');
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      message.error('Failed to save company information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>Loading company information...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Title level={4} style={{ marginBottom: '24px' }}>Logo & Banner Image</Title>
      
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        {/* Logo Upload */}
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Upload Logo</Text>
          <div style={{ 
            border: '2px dashed #d9d9d9',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fafafa',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {logo ? (
              <div style={{ marginBottom: '16px' }}>
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  style={{ 
                    maxWidth: '150px', 
                    maxHeight: '150px',
                    objectFit: 'contain'
                  }} 
                />
              </div>
            ) : (
              <div style={{ marginBottom: '16px', color: '#999' }}>
                <PictureOutlined style={{ fontSize: '48px' }} />
              </div>
            )}
            <Upload
              name="image"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleLogoUpload}
              action="/api/companies/upload-image"
            >
              <Button icon={<UploadOutlined />}>
                {logo ? 'Replace' : 'Upload Logo'}
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
              3.5 MB • Remove • Replace
            </Text>
          </div>
        </div>

        {/* Banner Upload */}
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Banner Image</Text>
          <div style={{ 
            border: '2px dashed #d9d9d9',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fafafa',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {banner ? (
              <div style={{ marginBottom: '16px' }}>
                <img 
                  src={banner} 
                  alt="Company Banner" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '120px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            ) : (
              <div style={{ marginBottom: '16px', color: '#999' }}>
                <PictureOutlined style={{ fontSize: '48px' }} />
              </div>
            )}
            <Upload
              name="image"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleBannerUpload}
              action="/api/companies/upload-image"
            >
              <Button icon={<PictureOutlined />}>
                {banner ? 'Replace' : 'Upload Banner'}
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
              4.3 MB • Remove • Replace
            </Text>
          </div>
        </div>
      </div>

      {/* Company Information Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Form.Item
          label="Company name"
          name="name"
          rules={[{ required: true, message: 'Please enter company name!' }]}
        >
          <Input 
            placeholder="Enter company name" 
            style={{ height: '40px' }}
          />
        </Form.Item>

        <Form.Item
          label="About us"
          name="description"
        >
          <TextArea
            rows={8}
            placeholder="Write down about your company here. Let the candidate know who we are..."
            showCount
            maxLength={1000}
            style={{ resize: 'vertical' }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />}
            loading={saving}
            size="large"
            style={{ 
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              height: '40px',
              paddingLeft: '24px',
              paddingRight: '24px'
            }}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CompanyInfo;