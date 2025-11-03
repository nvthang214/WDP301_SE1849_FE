import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Button, Avatar, Typography } from 'antd';
import { UserOutlined, DeleteOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { UploadService } from '../../../../services/UploadService';
import useAuthStore from '../../../../store/useAuthStore';
import { notifySuccess, notifyError } from '../../../../components/Notification';

const { Text } = Typography;

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
// Cho phép mọi định dạng ảnh hợp lệ (image/*)

const AvatarSetting = () => {
  const { user: userData, loading, fetchMe } = useAuthStore();
  const userId = useMemo(() => userData?._id || userData?.id || userData?.userId || null, [userData]);

  const avatarInputRef = useRef(null);
  const [isAvatarBusy, setIsAvatarBusy] = useState(false);
  const [avatarData, setAvatarData] = useState(null);

  useEffect(() => {
    if (!userData) {
      fetchMe();
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

  const validateAvatarFile = (file) => {
    if (!file?.type?.startsWith('image/')) {
      notifyError('Avatar must be a valid image file.');
      return false;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      notifyError('Maximum image size is 5 MB.');
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

  const avatarUrl = deriveAvatarUrl();
  const hasAvatar = !!(avatarUrl && avatarUrl.trim());

  return (
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
  );
};

export default AvatarSetting;