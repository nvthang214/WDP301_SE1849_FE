import React, { useState } from "react";
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Tag, 
  Dropdown, 
  Space,
  Row,
  Col,
  Statistic
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EyeOutlined,
  MoreOutlined,
  CrownOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  RightOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const RecruiterOverview = () => {
  const [loading, setLoading] = useState(false);

  // Mock data for jobs
  const jobsData = [
    {
      key: '1',
      job: 'UI/UX Designer',
      type: 'Full Time',
      remaining: '27 days remaining',
      status: 'Active',
      applications: 788,
      actions: 'view'
    },
    {
      key: '2',
      job: 'Senior UX Designer',
      type: 'Internship',
      remaining: '8 days remaining',
      status: 'Active',
      applications: 185,
      actions: 'view'
    },
    {
      key: '3',
      job: 'Technical Support Specialist',
      type: 'Part Time',
      remaining: '4 days remaining',
      status: 'Active',
      applications: 556,
      actions: 'view'
    },
    {
      key: '4',
      job: 'Junior Graphic Designer',
      type: 'Full Time',
      remaining: '24 days remaining',
      status: 'Active',
      applications: 183,
      actions: 'view'
    },
    {
      key: '5',
      job: 'Front End Developer',
      type: 'Full Time',
      remaining: 'Dec 7, 2019',
      status: 'Expire',
      applications: 740,
      actions: 'view'
    }
  ];

  // Action menu items
  const getActionItems = (record) => [
    {
      key: 'promote',
      label: (
         <Space>
           <CrownOutlined />
           Promote Job
         </Space>
       ),
    },
    {
      key: 'view',
      label: (
        <Space>
          <InfoCircleOutlined />
          View Detail
        </Space>
      ),
    },
    {
      key: 'expire',
      label: (
        <Space>
          <ClockCircleOutlined />
          Mark as expired
        </Space>
      ),
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'JOB',
      dataIndex: 'job',
      key: 'job',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {record.type} • {record.remaining}
          </div>
        </div>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'Active' ? 'green' : 'red'}
          style={{ borderRadius: '12px', padding: '2px 8px' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'APPLICATIONS',
      dataIndex: 'applications',
      key: 'applications',
      render: (applications) => (
        <Space>
          <UserOutlined style={{ color: '#666' }} />
          <span>{applications} Applications</span>
        </Space>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small"
            style={{ borderRadius: '6px' }}
          >
            View Applications
          </Button>
          <Dropdown
            menu={{ 
              items: getActionItems(record),
              onClick: ({ key }) => {
                console.log(`Action ${key} clicked for job ${record.job}`);
              }
            }}
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<MoreOutlined />} 
              size="small"
              style={{ color: '#666' }}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
          Hello, Instagram
        </Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Here is your daily activities and applications
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <FileTextOutlined style={{ color: '#3b82f6' }} />
                   <span style={{ color: '#6b7280', fontSize: '14px' }}>Open Jobs</span>
                 </div>
               }
              value={589}
              valueStyle={{ 
                color: '#1f2937', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <Statistic
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserOutlined style={{ color: '#f59e0b' }} />
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Saved Candidates</span>
                </div>
              }
              value={2517}
              valueStyle={{ 
                color: '#1f2937', 
                fontSize: '32px', 
                fontWeight: 'bold' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recently Posted Jobs Table */}
      <Card 
        style={{ 
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
            Recently Posted Jobs
          </Title>
          <Button 
            type="link" 
            style={{ 
              color: '#3b82f6',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
             View all
             <RightOutlined style={{ fontSize: '12px' }} />
           </Button>
        </div>

        <Table
          columns={columns}
          dataSource={jobsData}
          pagination={false}
          loading={loading}
          style={{ 
            '.ant-table-thead > tr > th': {
              background: '#f9fafb',
              border: 'none',
              color: '#6b7280',
              fontSize: '12px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }
          }}
        />
      </Card>
    </div>
  );
};

export default RecruiterOverview;
