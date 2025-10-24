import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Card,
  Spin,
  Select,
  Row,
  Col
} from 'antd';
import { notifySuccess, notifyError } from '../../../../components/Notification';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  SaveOutlined,
  LoadingOutlined,
  LinkOutlined,
  PlusOutlined,
  DeleteOutlined,
  LinkedinOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { CompanyService } from '../../../../services/CompanyService';

const { Title, Text } = Typography;

const SocialMediaProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

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
        
        // Convert social object to array of social links
        const links = Object.keys(social)
          .filter(key => social[key])
          .map((key, index) => ({
            id: Date.now() + index,
            platform: key,
            url: social[key]
          }));
        
        setSocialLinks(links.length > 0 ? links : [{ id: Date.now(), platform: '', url: '' }]);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      notifyError('Failed to load social media information');
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (url) => {
    if (!url) return '';
    
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    
    return url;
  };

  const validateUrlForForm = (_, value) => {
    if (!value) return Promise.resolve();
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([/\w \.-]*)*\/?$/;
    if (!urlPattern.test(value)) {
      return Promise.reject(new Error('Please enter a valid URL'));
    }
    return Promise.resolve();
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now(), platform: '', url: '' }]);
  };

  const removeSocialLink = (id) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id, field, value) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const getPlaceholder = (platform) => {
    const option = socialMediaOptions.find(opt => opt.value === platform);
    return option ? option.placeholder : 'Profile link/url...';
  };



  const handleSubmit = async () => {
    try {
      setSaving(true);

      // Validate and format social media URLs
      const socialData = {};
      
      // Process social links
      socialLinks.forEach(link => {
        if (link.platform && link.url) {
          socialData[link.platform] = validateUrl(link.url);
        }
      });

      const updateData = {
        social: socialData
      };

      let response;
      if (companyData) {
        // Update existing company
        response = await CompanyService.updateCompany(companyData._id, updateData);
      } else {
        // Create new company with required fields
        const newCompanyData = {
          name: 'New Company', // Default name, user can update later
          recruiter: 'current-recruiter-id', // This should be set from auth context
          ...updateData
        };
        response = await CompanyService.createCompany(newCompanyData);
      }

      if (response.success || response.data) {
        notifySuccess('Social media links saved successfully!');
        if (!companyData) {
          // Refresh data after creating new company
          fetchCompanyData();
        }
      } else {
        throw new Error(response.message || 'Failed to save social media links');
      }
    } catch (error) {
      console.error('Error saving social media links:', error);
      notifyError(error.message || 'Failed to save social media links');
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

  const socialMediaOptions = [
    {
      value: 'facebook',
      label: 'Facebook',
      icon: <FacebookOutlined style={{ color: '#1877F2', fontSize: '16px' }} />,
      placeholder: 'https://facebook.com/yourcompany'
    },
    {
      value: 'twitter',
      label: 'Twitter',
      icon: <TwitterOutlined style={{ color: '#1DA1F2', fontSize: '16px' }} />,
      placeholder: 'https://twitter.com/yourcompany'
    },
    {
      value: 'instagram',
      label: 'Instagram',
      icon: <InstagramOutlined style={{ color: '#E4405F', fontSize: '16px' }} />,
      placeholder: 'https://instagram.com/yourcompany'
    },
    {
      value: 'youtube',
      label: 'YouTube',
      icon: <YoutubeOutlined style={{ color: '#FF0000', fontSize: '16px' }} />,
      placeholder: 'https://youtube.com/yourcompany'
    },
    {
      value: 'linkedin',
      label: 'LinkedIn',
      icon: <LinkedinOutlined style={{ color: '#0A66C2', fontSize: '16px' }} />,
      placeholder: 'https://linkedin.com/company/yourcompany'
    }
  ];

  return (
    <div>
      <Title level={4}>Social Media Profile</Title>
      <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
        Add your company's social media links to help candidates learn more about your company culture and values.
      </Text>

      <div style={{ maxWidth: '600px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {socialLinks.map((link, index) => (
            <Card key={link.id} size="small" style={{ backgroundColor: '#fafafa' }}>
              <Text strong style={{ marginBottom: '12px', display: 'block' }}>
                Social Link {index + 1}
              </Text>
              <Row gutter={12} align="middle">
                <Col span={8}>
                  <Select
                    placeholder="Select platform"
                    value={link.platform}
                    onChange={(value) => updateSocialLink(link.id, 'platform', value)}
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                  >
                    {socialMediaOptions.map((option) => (
                      <Select.Option 
                        key={option.value} 
                        value={option.value}
                        label={
                          <Space>
                            {option.icon}
                            {option.label}
                          </Space>
                        }
                      >
                        <Space>
                          {option.icon}
                          {option.label}
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={14}>
                  <Input
                    placeholder={getPlaceholder(link.platform)}
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                    prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
                  />
                </Col>
                <Col span={2}>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeSocialLink(link.id)}
                    disabled={socialLinks.length === 1}
                  />
                </Col>
              </Row>
            </Card>
          ))}

          {/* Add New Social Link Button */}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSocialLink}
            style={{ width: '100%', marginTop: '16px' }}
          >
            Add New Social Link
          </Button>

          <div style={{ marginTop: '32px' }}>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              loading={saving}
              size="large"
              style={{ width: '200px' }}
              onClick={handleSubmit}
            >
              Save Social Media Links
            </Button>
          </div>
        </Space>
      </div>

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