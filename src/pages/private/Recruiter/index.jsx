import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Button, Typography, Space, Tag, Dropdown, Menu } from "antd";
import { EyeOutlined, EditOutlined, MoreOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { RecruiterService } from '../../../services/RecruiterService';

const { Title, Text } = Typography;

const RecruiterOverview = () => {
  const [stats, setStats] = useState({
    openJobs: 0,
    savedCandidates: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch stats and recent jobs in parallel
      const [statsResponse, jobsResponse] = await Promise.all([
        RecruiterService.getStats(),
        RecruiterService.getRecentJobs()
      ]);

      console.log('Stats Response:', statsResponse);
      console.log('Jobs Response:', jobsResponse);

      if (statsResponse.isOk) {
        console.log('Setting stats:', statsResponse.data);
        setStats(statsResponse.data);
      }

      if (jobsResponse.isOk) {
        setRecentJobs(jobsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActionMenu = (record) => (
    <Menu>
      <Menu.Item key="promote" icon={<SettingOutlined />}>
        Promote Job
      </Menu.Item>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        View Detail
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        Mark as expired
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'JOB TITLE',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div className="font-medium mb-1 text-gray-900">{text}</div>
          <Text type="secondary" className="text-xs text-gray-500">
            {record.type} • {record.duration}
          </Text>
        </div>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'} className="font-medium">
          {status}
        </Tag>
      ),
    },
    {
      title: 'APPLICATIONS',
      dataIndex: 'applications',
      key: 'applications',
      render: (applications) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-500" />
          <span className="text-gray-700">{applications} Applications</span>
        </div>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" className="bg-blue-600 hover:bg-blue-700 border-blue-600">
            View Applications
          </Button>
          <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} className="hover:bg-gray-100" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading overview data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button 
              onClick={fetchData} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Title level={3} className="!mb-2 !text-gray-900">
          Hello, Instagram
        </Title>
        <Text type="secondary" className="text-gray-600">Here is your daily activities and job alerts</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={12}>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.openJobs}</div>
                <div className="text-gray-600 text-sm font-medium">Open Jobs</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                 <SettingOutlined className="text-blue-600 text-xl" />
               </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.savedCandidates}</div>
                <div className="text-gray-600 text-sm font-medium">Saved Candidates</div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <UserOutlined className="text-orange-600 text-xl" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recently Posted Jobs */}
      <Card 
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Recently Posted Jobs</span>
            <Button type="link" className="!p-0 text-blue-600 hover:text-blue-700">
              View all →
            </Button>
          </div>
        }
        className="border-0 shadow-sm"
      >
        <Table
          columns={columns}
          dataSource={recentJobs}
          loading={loading}
          pagination={false}
          className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:border-b-2 [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-tbody>tr:hover>td]:bg-blue-50"
        />
      </Card>
    </div>
  );
};

export default RecruiterOverview;
