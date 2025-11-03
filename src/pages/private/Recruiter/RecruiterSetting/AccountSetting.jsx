import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Alert,
  Avatar
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
  LoadingOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { UserService } from '../../../../services/UserService';
import { AuthService } from '../../../../services/AuthService';
import { UploadService } from '../../../../services/UploadService';
import useAuthStore from '../../../../store/useAuthStore';

const { Title, Text } = Typography;
const { confirm } = Modal;

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
// Cho phép mọi định dạng ảnh hợp lệ (image/*)

const AccountSetting = () => {
  const [contactForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [savingContact, setSavingContact] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Sử dụng auth store
  const { user: userData, loading, fetchMe, logout } = useAuthStore();
  const userId = useMemo(() => userData?._id || userData?.id || userData?.userId || null, [userData]);

  // Avatar state
  const avatarInputRef = useRef(null);
  const [isAvatarBusy, setIsAvatarBusy] = useState(false);
  const [avatarData, setAvatarData] = useState(null);

  useEffect(() => {
    if (!userData) {
      fetchMe();
    } else {
      fillForm(userData);
    }
  }, [userData, fetchMe]);

  useEffect(() => {
    if (!loading && userId) {
      (async () => {
        try {
          const res = await UploadService.getUserAvatar(userId);
          if (!res?.isError) {
            setAvatarData(res?.data || null);
          }
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [loading, userId]);

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

  const validateAvatarFile = (file) => {
    if (!file?.type?.startsWith('image/')) {
      notifyError("Avatar must be a valid image file.");
      return false;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      notifyError("Maximum image size is 5 MB.");
      return false;
    }
    return true;
  };

  const handleAvatarUpload = async (file) => {
    if (!userId || !validateAvatarFile(file)) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setIsAvatarBusy(true);
    try {
      const action = avatarData ? UploadService.updateUserAvatar : UploadService.addUserAvatar;
      const response = await action(userId, formData);
      if (response?.isError) {
        throw new Error(response?.msg || 'Unable to upload avatar.');
      }
      const nextAvatar = response?.data || null;
      setAvatarData(nextAvatar);
      // đồng bộ về auth store
      useAuthStore.setState((state) => {
        if (!state.user) return {};
        const serializedAvatar = nextAvatar ? JSON.stringify(nextAvatar) : null;
        return { user: { ...state.user, avatar: serializedAvatar } };
      });
      notifySuccess(response?.msg || 'Avatar updated.');
    } catch (error) {
      console.error(error);
      notifyError(error.message || 'Unable to upload avatar.');
    } finally {
      setIsAvatarBusy(false);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleAvatarUpload(file);
    e.target.value = '';
  };

  const handleAvatarDelete = async () => {
    if (!userId || !avatarData) return;
    setIsAvatarBusy(true);
    try {
      const response = await UploadService.deleteUserAvatar(userId);
      if (response?.isError) {
        throw new Error(response?.msg || 'Unable to delete avatar.');
      }
      setAvatarData(null);
      useAuthStore.setState((state) => {
        if (!state.user) return {};
        return { user: { ...state.user, avatar: null } };
      });
      notifySuccess(response?.msg || 'Avatar deleted.');
    } catch (error) {
      console.error(error);
      notifyError(error.message || 'Unable to delete avatar.');
    } finally {
      setIsAvatarBusy(false);
    }
  };

  const deriveAvatarUrl = () => {
    if (avatarData?.url) return avatarData.url;
    const raw = userData?.avatar;
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        return parsed?.url || raw;
      } catch {
        return raw;
      }
    }
    return null;
  };

  const handleContactInfoSave = async (values) => {
    try {
      setSavingContact(true);
      const response = await UserService.updateProfile(userData._id, values);
      
      if (response.isOk) {
        notifySuccess('Contact information updated successfully!');
        // Gọi lại fetchMe để cập nhật user data trong auth store
        await fetchMe();
      } else {
        notifyError(response.msg || 'Failed to update contact information!');
      }
    } catch (error) {
      notifyError('Failed to update contact information!');
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
        notifySuccess('Password updated successfully!');
        passwordForm.resetFields();
      } else {
        notifyError(response.msg || 'Failed to update password!');
      }
    } catch (error) {
      notifyError('Password could not be updated!');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    confirm({
      title: 'Are you sure you want to delete this account?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>This action cannot be undone. All your data will be permanently deleted including:</p>
          <ul>
            <li>Your profile information</li>
            <li>Company information</li>
            <li>Posted jobs</li>
            <li>Application history</li>
          </ul>
          <p><strong>Please type "DELETE" to confirm:</strong></p>
        </div>
      ),
      okText: 'Delete Account',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await UserService.deleteUser(userData._id);
          if (response.isOk) {
            notifySuccess('Account deleted successfully!');
            // Clear auth state and redirect to login page
            await logout();
            window.location.href = '/login';
          } else {
            notifyError(response.msg || 'Unable to delete account!');
          }
        } catch (error) {
          notifyError('Unable to delete account!');
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

  const avatarUrl = deriveAvatarUrl();
  const hasAvatar = !!(avatarUrl && avatarUrl.trim());

  return (
    <div>
      <Title level={4}>Account Settings</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Avatar */}
        <Card title="Avatar" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar
              src={hasAvatar ? avatarUrl : undefined}
              size={64}
              style={{ backgroundColor: hasAvatar ? undefined : '#1890ff', color: '#fff' }}
              icon={!hasAvatar ? <UserOutlined /> : undefined}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={handleAvatarFileChange}
                style={{ display: 'none' }}
              />
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={isAvatarBusy}
                onClick={() => avatarInputRef.current?.click()}
              >
                Upload Avatar
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={!hasAvatar || isAvatarBusy}
                onClick={handleAvatarDelete}
              >
                Delete Avatar
              </Button>
            </div>
          </div>
          {!hasAvatar && (
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              Supports all image formats (image/*), up to 5MB
            </Text>
          )}
        </Card>

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

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={changingPassword}
              >
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default AccountSetting;