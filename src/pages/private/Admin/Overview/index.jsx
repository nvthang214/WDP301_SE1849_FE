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
      setError('Unable to load data. Please try again.');
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
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
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
        message="No Data"
        description="Failed to load statistics."
        type="warning"
        showIcon
      />
    );
  }

  return (
  <div className="p-0 m-0">
    {/* 🔹 User Statistics Banner */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-4 flex items-center">
      <UserOutlined className="mr-3 text-2xl text-white" />
      <h2 className="text-xl font-semibold mb-0">User Statistics</h2>
    </div>

    {/* User Statistics Section */}
    <div className="mb-8">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Total Users"
              value={stats.users?.total || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Active Users"
              value={stats.users?.active || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Banned Users"
              value={stats.users?.banned || 0}
              prefix={<LockOutlined />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>

    {/* 🔹 Upgrade Request Statistics Banner */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-4 flex items-center">
      <FileTextOutlined className="mr-3 text-2xl text-white" />
      <h2 className="text-xl font-semibold mb-0">Upgrade Request Statistics</h2>
    </div>

    {/* Upgrade Request Section */}
    <div className="mb-8">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Total Requests"
              value={stats.upgradeRequests?.total || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Pending"
              value={stats.upgradeRequests?.pending || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Approved"
              value={stats.upgradeRequests?.approved || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Rejected"
              value={stats.upgradeRequests?.rejected || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>

    {/* 🔹 Job and Company Statistics Banner */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-4 flex items-center">
      <BuildOutlined className="mr-3 text-2xl text-white" />
      <h2 className="text-xl font-semibold mb-0">Job and Company Statistics</h2>
    </div>

    {/* Job and Company Section */}
    <div className="mb-8">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Total Jobs"
              value={stats.jobs?.total || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Active Jobs"
              value={stats.jobs?.active || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title="Total Companies"
              value={stats.companies?.total || 0}
              prefix={<BuildOutlined />}
              valueStyle={{ color: '#722ed1', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>

    {/* 🔹 User Registration Banner */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <TeamOutlined className="mr-3 text-2xl text-white" />
        <h2 className="text-xl font-semibold mb-0">User Registration by Month</h2>
      </div>
      <DatePicker
        picker="year"
        value={selectedYear}
        onChange={handleYearChange}
        style={{ width: 150 }}
        size="large"
        format="YYYY"
      />
    </div>

    {/* User Registration Section */}
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300" title="Line Chart">
          <Line {...chartConfig} height={300} />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300" title="Column Chart">
          <Column {...columnConfig} height={300} />
        </Card>
      </Col>
    </Row>
  </div>
);

};

export default AdminOverview;
