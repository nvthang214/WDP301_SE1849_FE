import React, { useEffect, useState } from 'react';
import { Spin, Alert, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';

const AdminAuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const { user, accessToken, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [user, accessToken]);

  const checkAuth = () => {
    try {
      if (!accessToken || !user) {
        navigate('/login');
        return;
      }
      
      if (user.role !== 'admin') {
        navigate('/');
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Không có quyền truy cập"
          description="Bạn cần đăng nhập với tài khoản admin để truy cập trang này."
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={handleLogout}>
              Đăng nhập lại
            </Button>
          }
        />
      </div>
    );
  }

  return children;
};

export default AdminAuthGuard;
