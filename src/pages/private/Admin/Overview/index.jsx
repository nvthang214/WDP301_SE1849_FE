import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Spin, 
  Alert,
  Typography,
  DatePicker
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CrownOutlined, 
  LockOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  BuildOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import { AdminService } from '../../../../services/AdminService';
import dayjs from 'dayjs';

const { Title } = Typography;

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [registrationData, setRegistrationData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRegistrationData();
  }, [selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const statsResponse = await AdminService.getOverviewStats();
      const statsData = statsResponse.data || statsResponse;

      setStats(statsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationData = async () => {
    try {
      const year = selectedYear.year();
      const registrationResponse = await AdminService.getUserRegistrationStats(year);
      const registrationStatsData = registrationResponse.data || registrationResponse;
      setRegistrationData(registrationStatsData);
    } catch (err) {
      console.error('Error fetching registration data:', err);
    }
  };

  const handleYearChange = (date) => {
    if (date) {
      setSelectedYear(date);
    }
  };

  // Prepare chart data
  const chartData = registrationData.map(item => ({
    month: item.monthName,
    users: item.count,
  }));

  const chartConfig = {
    data: chartData,
    xField: 'month',
    yField: 'users',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const columnConfig = {
    data: chartData,
    xField: 'month',
    yField: 'users',
    color: '#1890ff',
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        className="mb-4"
      />
    );
  }

  if (!stats) {
    return (
      <Alert
        message="Không có dữ liệu"
        description="Không thể tải dữ liệu thống kê."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Admin Dashboard</Title>
      
      {/* User Statistics */}
      <div className="mb-6">
        <Title level={4} className="mb-4">Thống kê người dùng</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng người dùng"
                value={stats.users?.total || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Người dùng hoạt động"
                value={stats.users?.active || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Người dùng bị khóa"
                value={stats.users?.banned || 0}
                prefix={<LockOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Upgrade Request Statistics */}
      <div className="mb-6">
        <Title level={4} className="mb-4">Thống kê yêu cầu nâng cấp</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng yêu cầu"
                value={stats.upgradeRequests?.total || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Chờ duyệt"
                value={stats.upgradeRequests?.pending || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã duyệt"
                value={stats.upgradeRequests?.approved || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Đã từ chối"
                value={stats.upgradeRequests?.rejected || 0}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Job and Company Statistics */}
      <div className="mb-6">
        <Title level={4} className="mb-4">Thống kê công việc và công ty</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng công việc"
                value={stats.jobs?.total || 0}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Công việc đang hoạt động"
                value={stats.jobs?.active || 0}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Tổng công ty"
                value={stats.companies?.total || 0}
                prefix={<BuildOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* User Registration Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} className="mb-0">Biểu đồ đăng ký người dùng theo tháng</Title>
          <DatePicker
            picker="year"
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 150 }}
            size="large"
            format="YYYY"
          />
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card>
              <Line {...chartConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <Column {...columnConfig} height={300} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminOverview;

