import React, { useState } from "react";
import { Input, Button, Select, Form, Typography, Card, Tabs, message } from "antd";
import {
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  EnvironmentOutlined,
  PhoneOutlined,
  LockOutlined,
  DeleteOutlined,
  UserOutlined,
  ShareAltOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { AuthService } from "../../../../services/AuthService";
import CompanyInfo from "./CompanyInfo";
import SocialMedia from "./SocialMedia";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AccountSettingPage() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("3");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (values) => {
    try {
      setIsChangingPassword(true);
      
      // Validate passwords match
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        setIsChangingPassword(false);
        return;
      }

      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      };

      const result = await AuthService.changePassword(payload);
      
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      
    } catch (error) {
      console.error("Change password error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      if (error.response?.status === 404) {
        message.error("Chức năng đổi mật khẩu chưa được hỗ trợ bởi server!");
      } else {
        message.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-2">
          <UserOutlined />
          <span>Company Info</span>
        </div>
      ),
      children: <CompanyInfo />
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <ShareAltOutlined />
          <span>Social Media Profile</span>
        </div>
      ),
      children: <SocialMedia />
    },
    {
      key: "3",
      label: (
        <div className="flex items-center gap-2">
          <SettingOutlined />
          <span>Account Setting</span>
        </div>
      ),
      children: (
        <div style={{ padding: '24px 0' }}>
          {/* Contact Information Section */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={4} style={{ marginBottom: '16px', color: '#1f2937' }}>
              Contact Information
            </Title>
            
            <Form form={form} layout="vertical">
              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Email Address</span>}
                style={{ marginBottom: '24px' }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Enter your email address"
                  size="large"
                />
              </Form.Item>

              <Button 
                type="primary" 
                size="large" 
                style={{ 
                  background: '#3b82f6', 
                  borderColor: '#3b82f6',
                  fontWeight: 500
                }}
              >
                Save Changes
              </Button>
            </Form>
          </div>

          {/* Change Password Section */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={4} style={{ marginBottom: '16px', color: '#1f2937' }}>
              Change Password
            </Title>
            
            <Form 
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
            >
              <Form.Item 
                name="currentPassword"
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Current Password</span>}
                style={{ marginBottom: '20px' }}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
                ]}
              >
                <Input.Password
                  placeholder="Enter current password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  size="large"
                />
              </Form.Item>
              
              <Form.Item 
                name="newPassword"
                label={<span style={{ fontWeight: 500, color: '#374151' }}>New Password</span>}
                style={{ marginBottom: '20px' }}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  placeholder="Enter new password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  size="large"
                />
              </Form.Item>
              
              <Form.Item 
                name="confirmPassword"
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Confirm Password</span>}
                style={{ marginBottom: '24px' }}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm new password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  size="large"
                />
              </Form.Item>
              
              <Button 
                type="primary" 
                size="large" 
                htmlType="submit"
                loading={isChangingPassword}
                style={{ 
                  background: '#3b82f6', 
                  borderColor: '#3b82f6',
                  fontWeight: 500
                }}
              >
                {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Change Password'}
              </Button>
            </Form>
          </div>

          {/* Delete Account Section */}
          <div>
            <Title level={4} style={{ marginBottom: '16px', color: '#1f2937' }}>
              Delete Your Company
            </Title>
            
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px', lineHeight: '1.5' }}>
              If you delete your JobPilot account, you will lose all your saved jobs,
              matched info, and more. This action cannot be undone.
            </Text>

            <div 
              style={{
                padding: '16px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            >
              <Text style={{ color: '#dc2626', fontWeight: 500 }}>
                Warning: This action is permanent
              </Text>
              <br />
              <Text style={{ color: '#7f1d1d', fontSize: '14px' }}>
                All your data will be permanently deleted and cannot be recovered.
              </Text>
            </div>

            <Button
              danger
              size="large"
              icon={<DeleteOutlined />}
              style={{ fontWeight: 500 }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Settings</Title>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
}