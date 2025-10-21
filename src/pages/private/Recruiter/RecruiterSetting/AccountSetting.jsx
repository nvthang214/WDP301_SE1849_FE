import React, { useState, useEffect } from "react";
import { Input, Button, Select, Form, Typography, Card, Tabs, message, Spin } from "antd";
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
import { UserService } from "../../../../services/UserService";
import CompanyInfoPage from "./CompanyInfo";
import SocialMediaPage from "./SocialMedia";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AccountSettingPage() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("1");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        return userData?._id || userData?.id;
      }
      
      // Fallback: try to get from token
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
    return null;
  };

  // Load user profile
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      if (!userId) {
        message.error("Không thể xác định người dùng!");
        return;
      }

      const response = await UserService.getUserProfileById(userId);
      
      if (response?.data) {
        setUserInfo(response.data);
        // Set form values
        form.setFieldsValue({
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phoneNumber: response.data.phoneNumber,
          username: response.data.username
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      message.error("Không thể tải thông tin tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (values) => {
    try {
      setIsUpdatingProfile(true);
      const userId = getUserId();
      
      if (!userId) {
        message.error("Không thể xác định người dùng!");
        return;
      }

      const response = await UserService.updateProfile(userId, values);
      
      if (response?.data) {
        setUserInfo(response.data);
        message.success("Cập nhật thông tin thành công!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.response?.data?.msg || "Cập nhật thông tin thất bại!");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setIsChangingPassword(true);
      
      // Validate passwords match
      if (values.newPassword !== values.confirmPassword) {
        message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }

      const payload = {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      };

      console.log("Change password payload:", payload);
      const result = await UserService.changeUserPassword(payload);
      
      message.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
      
    } catch (error) {
      console.error("Change password error:", error);
      if (error.response?.status === 400) {
        message.error(error.response?.data?.msg || "Mật khẩu hiện tại không đúng!");
      } else if (error.response?.status === 404) {
        message.error("Chức năng đổi mật khẩu chưa được hỗ trợ bởi server!");
      } else {
        message.error(error.response?.data?.msg || "Đổi mật khẩu thất bại!");
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
      children: <CompanyInfoPage />
    },
    {
      key: "2",
      label: (
        <div className="flex items-center gap-2">
          <ShareAltOutlined />
          <span>Social Media Profile</span>
        </div>
      ),
      children: <SocialMediaPage />
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>Đang tải thông tin tài khoản...</div>
            </div>
          ) : (
            <>
              {/* Contact Information Section */}
              <div style={{ marginBottom: '32px' }}>
                <Title level={4} style={{ marginBottom: '16px', color: '#1f2937' }}>
                  Thông tin tài khoản
                </Title>
                
                <Form 
                  form={form} 
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <Form.Item
                      name="firstName"
                      label={<span style={{ fontWeight: 500, color: '#374151' }}>Họ</span>}
                      rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                        placeholder="Nhập họ"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="lastName"
                      label={<span style={{ fontWeight: 500, color: '#374151' }}>Tên</span>}
                      rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                        placeholder="Nhập tên"
                        size="large"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="email"
                    label={<span style={{ fontWeight: 500, color: '#374151' }}>Email</span>}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input
                      prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="Email"
                      size="large"
                      disabled
                    />
                  </Form.Item>

                  <Form.Item
                    name="username"
                    label={<span style={{ fontWeight: 500, color: '#374151' }}>Tên đăng nhập</span>}
                    style={{ marginBottom: '16px' }}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                      placeholder="Tên đăng nhập"
                      size="large"
                      disabled
                    />
                  </Form.Item>
                  <Button 
                    type="primary" 
                    size="large" 
                    htmlType="submit"
                    loading={isUpdatingProfile}
                    style={{ 
                      background: '#3b82f6', 
                      borderColor: '#3b82f6',
                      fontWeight: 500
                    }}
                  >
                    {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Form>
              </div>

               {/* Change Password Section */}
               <div style={{ marginBottom: '32px' }}>
                 <Title level={4} style={{ marginBottom: '16px', color: '#1f2937' }}>
                   Đổi mật khẩu
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
                    {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                  </Button>
                </Form>
              </div>

              {/* Delete Account Section */}
              <div>
                <Title level={4} style={{ marginBottom: '16px', color: '#1f2937' }}>
                  Xóa tài khoản
                </Title>
                
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px', lineHeight: '1.5' }}>
                  Nếu bạn xóa tài khoản JobPilot, bạn sẽ mất tất cả công việc đã lưu,
                  thông tin đã khớp và nhiều hơn nữa. Hành động này không thể hoàn tác.
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
                    Cảnh báo: Hành động này là vĩnh viễn
                  </Text>
                  <br />
                  <Text style={{ color: '#7f1d1d', fontSize: '14px' }}>
                    Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục.
                  </Text>
                </div>

                <Button
                  danger
                  size="large"
                  icon={<DeleteOutlined />}
                  style={{ fontWeight: 500 }}
                >
                  Xóa tài khoản
                </Button>
              </div>
            </>
          )}
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