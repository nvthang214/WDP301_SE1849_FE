import React, { useState, useEffect } from "react";
import { Button, Input, Select, Space, Typography, Form, message, Spin } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  LinkOutlined
} from "@ant-design/icons";
import { CompanyService } from "../../../../services/CompanyService";

const { Title, Text } = Typography;
const { Option } = Select;

// Tạo component LinkedIn icon đơn giản
const LinkedInOutlined = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function SocialMediaPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: 'facebook', url: '' }
  ]);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      console.log('Debug - localStorage user:', localStorage.getItem('user'));
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Debug - parsed user:', user);
      if (user && user.id) {
        console.log('Debug - user.id found:', user.id);
        return user.id;
      }
      
      console.log('Debug - localStorage accessToken:', localStorage.getItem('accessToken'));
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('Debug - token payload:', payload);
        return payload.userId || payload.id; // Try userId first, fallback to id
      }
      
      console.log('Debug - No user ID found, returning null');
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Load company data
  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      console.log('Debug - User ID:', userId);
      if (!userId) {
        message.error('Không thể lấy thông tin người dùng');
        return;
      }

      console.log('Debug - Calling API with userId:', userId);
      const response = await CompanyService.getCompanyByRecruiter(userId);
      console.log('Debug - API Response:', response);
      if (response.success && response.data) {
        setCompanyData(response.data);
        
        // Convert social media object to array format
        const social = response.data.social || {};
        const socialArray = [];
        
        Object.keys(social).forEach((platform, index) => {
          if (social[platform]) {
            socialArray.push({
              id: index + 1,
              platform: platform,
              url: social[platform]
            });
          }
        });
        
        // If no social links, add one empty link
        if (socialArray.length === 0) {
          socialArray.push({ id: 1, platform: 'facebook', url: '' });
        }
        
        setSocialLinks(socialArray);
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      console.log('Debug - Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      if (error.response?.status !== 404) {
        message.error('Không thể tải thông tin mạng xã hội');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle save social media
  const handleSave = async () => {
    try {
      setSaving(true);
      const userId = getUserId();
      if (!userId) {
        message.error('Không thể lấy thông tin người dùng');
        return;
      }

      // Convert social links array to object format
      const socialObject = {};
      socialLinks.forEach(link => {
        if (link.url && link.url.trim()) {
          socialObject[link.platform] = link.url.trim();
        }
      });

      const payload = {
        social: socialObject
      };

      let response;
      if (companyData && companyData._id) {
        // Update existing company
        response = await CompanyService.updateCompany(companyData._id, payload);
      } else {
        // Create new company with social media
        const companyPayload = {
          name: 'Tên công ty',
          description: '',
          social: socialObject
        };
        response = await CompanyService.createCompany(companyPayload);
      }

      if (response.success) {
        message.success('Thông tin mạng xã hội đã được lưu thành công!');
        setCompanyData(response.data);
      } else {
        message.error('Có lỗi xảy ra khi lưu thông tin mạng xã hội');
      }
    } catch (error) {
      console.error('Error saving social media:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin mạng xã hội');
    } finally {
      setSaving(false);
    }
  };

  // Add new social link
  const addSocialLink = () => {
    const newId = Math.max(...socialLinks.map(link => link.id)) + 1;
    setSocialLinks([...socialLinks, { id: newId, platform: 'facebook', url: '' }]);
  };

  // Remove social link
  const removeSocialLink = (id) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter(link => link.id !== id));
    }
  };

  // Update social link
  const updateSocialLink = (id, field, value) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  useEffect(() => {
    loadCompanyData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Social Links */}
      <div style={{ marginBottom: '32px' }}>
        {socialLinks.map((link) => (
          <div key={link.id} style={{ marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 500 }}>
              Liên kết mạng xã hội {link.id}
            </Text>
            <Space.Compact style={{ width: '100%' }} size="large">
              <Select
                value={link.platform}
                onChange={(value) => updateSocialLink(link.id, 'platform', value)}
                style={{ width: '200px' }}
              >
                <Option value="facebook">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FacebookOutlined style={{ color: "#1877f2" }} />
                    <span>Facebook</span>
                  </div>
                </Option>
                <Option value="twitter">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TwitterOutlined style={{ color: "#1da1f2" }} />
                    <span>Twitter</span>
                  </div>
                </Option>
                <Option value="instagram">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <InstagramOutlined style={{ color: "#d6249f" }} />
                    <span>Instagram</span>
                  </div>
                </Option>
                <Option value="youtube">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <YoutubeOutlined style={{ color: "red" }} />
                    <span>YouTube</span>
                  </div>
                </Option>
                <Option value="linkedin">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LinkedInOutlined />
                    <span>LinkedIn</span>
                  </div>
                </Option>
              </Select>
              <Input
                placeholder="https://..."
                value={link.url}
                onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                prefix={<LinkOutlined style={{ color: '#9ca3af' }} />}
                style={{ flex: 1 }}
              />
              <Button
                icon={<CloseOutlined />}
                onClick={() => removeSocialLink(link.id)}
                disabled={socialLinks.length === 1}
                danger
                style={{ 
                  background: '#fef2f2', 
                  borderColor: '#fecaca',
                  color: '#dc2626'
                }}
              />
            </Space.Compact>
          </div>
        ))}

        {/* Add New Button */}
        <Button
          type="dashed"
          icon={<PlusCircleOutlined />}
          onClick={addSocialLink}
          style={{
            width: "100%",
            height: '48px',
            borderColor: '#d1d5db',
            color: '#6b7280',
            fontSize: '14px',
            marginBottom: '24px'
          }}
        >
          Thêm liên kết mạng xã hội
        </Button>
      </div>

      {/* Save Button */}
      <Button
        type="primary"
        size="large"
        loading={saving}
        onClick={handleSave}
        style={{ 
          background: '#3b82f6', 
          borderColor: '#3b82f6', 
          fontWeight: 500 
        }}
      >
        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </div>
  );
}