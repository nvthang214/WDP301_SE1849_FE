import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Card,
  message,
  Spin
} from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  SaveOutlined,
  LoadingOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { CompanyService } from '../../../../services/CompanyService';

const { Title, Text } = Typography;

const SocialMediaProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await CompanyService.getCompanyByRecruiter();
      if (response.success && response.data) {
        setCompanyData(response.data);
        const social = response.data.social || {};
        form.setFieldsValue({
          facebook: social.facebook || '',
          twitter: social.twitter || '',
          instagram: social.instagram || '',
          youtube: social.youtube || '',
          linkedin: social.linkedin || '',
          website: social.website || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      message.error('Failed to load social media information');
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (_, value) => {
    if (!value) return Promise.resolve();
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(value)) {
      return Promise.reject(new Error('Please enter a valid URL'));
    }
    return Promise.resolve();
  };

  const handleSave = async (values) => {
    try {
      setSaving(true);
      
      // Ensure URLs have proper protocol
      const social = {};
      Object.keys(values).forEach(key => {
        if (values[key]) {
          let url = values[key];
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          social[key] = url;
        }
      });

      const updateData = {
        social
      };

      let response;
      if (companyData) {
        response = await CompanyService.updateCompany(companyData._id, updateData);
      } else {
        // If no company exists, create one with social media info
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

        response = await CompanyService.createCompany({
          name: 'Company Name', // Default name, user can update later
          recruiter: getUserId(),
          social
        });
      }

      if (response.isOk) {
        message.success('Social media links saved successfully!');
        setCompanyData(response.data);
      } else {
        message.error(response.msg || 'Failed to save social media links');
      }
    } catch (error) {
      console.error('Error saving social media info:', error);
      message.error('Failed to save social media links');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>Loading social media information...</div>
      </div>
    );
  }

  const socialMediaItems = [
    {
      name: 'facebook',
      label: 'Facebook',
      icon: <FacebookOutlined style={{ color: '#1877F2', fontSize: '20px' }} />,
      placeholder: 'https://facebook.com/yourcompany'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      icon: <TwitterOutlined style={{ color: '#1DA1F2', fontSize: '20px' }} />,
      placeholder: 'https://twitter.com/yourcompany'
    },
    {
      name: 'instagram',
      label: 'Instagram',
      icon: <InstagramOutlined style={{ color: '#E4405F', fontSize: '20px' }} />,
      placeholder: 'https://instagram.com/yourcompany'
    },
    {
      name: 'youtube',
      label: 'YouTube',
      icon: <YoutubeOutlined style={{ color: '#FF0000', fontSize: '20px' }} />,
      placeholder: 'https://youtube.com/yourcompany'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkOutlined style={{ color: '#0A66C2', fontSize: '20px' }} />,
      placeholder: 'https://linkedin.com/company/yourcompany'
    },
    {
      name: 'website',
      label: 'Company Website',
      icon: <LinkOutlined style={{ color: '#52c41a', fontSize: '20px' }} />,
      placeholder: 'https://yourcompany.com'
    }
  ];

  return (
    <div>
      <Title level={4}>Social Media Profile</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        Add your company's social media links to help candidates learn more about your company culture and values.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        style={{ maxWidth: '600px' }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {socialMediaItems.map((item) => (
            <Card key={item.name} size="small" style={{ backgroundColor: '#fafafa' }}>
              <Form.Item
                label={
                  <Space>
                    {item.icon}
                    <Text strong>{item.label}</Text>
                  </Space>
                }
                name={item.name}
                rules={[
                  { validator: validateUrl }
                ]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  placeholder={item.placeholder}
                  prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
                  size="large"
                />
              </Form.Item>
            </Card>
          ))}

          <Form.Item style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={saving}
              size="large"
              style={{ width: '200px' }}
            >
              Save Social Media Links
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <strong>Tips:</strong> Make sure your social media profiles are professional and up-to-date. 
          Candidates often check company social media to learn about company culture and work environment.
        </Text>
      </div>
    </div>
  );
};

export default SocialMediaProfile;