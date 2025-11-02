import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Card,
  Divider,
  Modal,
  Spin,
  Alert
} from 'antd';
import { notifySuccess, notifyError } from '../../../../components/Notification';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  DeleteOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { UserService } from '../../../../services/UserService';
import { AuthService } from '../../../../services/AuthService';
import useAuthStore from '../../../../store/useAuthStore';

const { Title, Text } = Typography;
const { confirm } = Modal;

const AccountSetting = () => {
  const [contactForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [savingContact, setSavingContact] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Sử dụng auth store
  const { user: userData, loading, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    if (!userData) {
      fetchMe();
    } else {
      fillForm(userData);
    }
  }, [userData, fetchMe]);

  const fillForm = (data) => {
    if (data) {
      contactForm.setFieldsValue({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address
      });
    }
  };

  const handleContactInfoSave = async (values) => {
    try {
      setSavingContact(true);
      const response = await UserService.updateProfile(userData._id, values);
      
      if (response.isOk) {
        notifySuccess('Thông tin liên hệ đã được cập nhật thành công!');
        // Gọi lại fetchMe để cập nhật user data trong auth store
        await fetchMe();
      } else {
        notifyError(response.msg || 'Thông tin liên hệ không thể được cập nhật!');
      }
    } catch (error) {
      notifyError('Thông tin liên hệ không thể được cập nhật!');
    } finally {
      setSavingContact(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setChangingPassword(true);
      const response = await AuthService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      
      if (response.isOk) {
        notifySuccess('Mật khẩu đã được cập nhật thành công!');
        passwordForm.resetFields();
      } else {
        notifyError(response.msg || 'Thông tin liên hệ không thể được cập nhật!');
      }
    } catch (error) {
      notifyError('Mật khẩu không thể được cập nhật!');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>This action cannot be undone. All your data will be permanently deleted including:</p>
          <ul>
            <li>Your profile information</li>
            <li>Admin access</li>
            <li>All administrative records</li>
          </ul>
          <p><strong>Please type "DELETE" to confirm:</strong></p>
        </div>
      ),
      okText: 'Xóa tài khoản',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await UserService.deleteUser(userData._id);
          if (response.isOk) {
            notifySuccess('Tài khoản đã được xóa thành công!');
            // Clear auth state and redirect to login page
            await logout();
            window.location.href = '/login';
          } else {
            notifyError(response.msg || 'Tài khoản không thể được xóa!');
          }
        } catch (error) {
          notifyError('Tài khoản không thể được xóa!');
        }
      }
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>Loading account information...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={4}>Account Settings</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Contact Information */}
        <Card title="Contact Information" style={{ maxWidth: '600px' }}>
          <Form
            form={contactForm}
            layout="vertical"
            onFinish={handleContactInfoSave}
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Enter your full name" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Enter your email address" 
                size="large"
                disabled // Usually email cannot be changed
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number!' }]}
            >
              <Input 
                prefix={<PhoneOutlined />} 
                placeholder="Enter your phone number" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
            >
              <Input.TextArea 
                placeholder="Enter your address" 
                rows={3}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={savingContact}
                size="large"
              >
                Save Contact Information
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Change Password */}
        <Card title="Change Password" style={{ maxWidth: '600px' }}>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              label="Current Password"
              name="oldPassword"
              rules={[{ required: true, message: 'Please enter your current password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter current password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Enter new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Confirm new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<LockOutlined />}
                loading={changingPassword}
                size="large"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Divider />

        {/* Danger Zone */}
        <Card 
          title={<Text type="danger">Danger Zone</Text>} 
          style={{ maxWidth: '600px', borderColor: '#ff4d4f' }}
        >
          <Alert
            message="Delete Account"
            description="Once you delete your account, there is no going back. Please be certain."
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            size="large"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Card>
      </Space>
    </div>
  );
};

export default AccountSetting;

