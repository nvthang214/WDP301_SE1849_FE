import React, { useState, useEffect, useContext } from "react";
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
  Statistic,
  message
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
import { RecruiterService } from "../../../services/RecruiterService";
import { Context } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";

const { Title, Text } = Typography;

const RecruiterOverview = () => {
  const [loading, setLoading] = useState(false);
  const [jobsData, setJobsData] = useState([]);
  const [statistics, setStatistics] = useState({
    openJobs: 0,
    totalApplications: 0
  });
  const { user } = useContext(Context);
  const navigate = useNavigate();

  // Fetch recruiter's jobs and statistics
  useEffect(() => {
    const fetchRecruiterData = async () => {
      if (!user?.userId) return;
      
      setLoading(true);
      try {
        // Fetch jobs by recruiter ID
        const jobsResponse = await RecruiterService.getJobsByRecruiterId(user.userId);
        
        if (jobsResponse.data?.success && jobsResponse.data?.data) {
          const jobs = jobsResponse.data.data;
          
          // Process jobs data for table
          const processedJobs = await Promise.all(
            jobs.slice(0, 5).map(async (job, index) => {
              let applicationsCount = 0;
              
              try {
                // Fetch applications for each job
                const applicationsResponse = await RecruiterService.getApplicationsByJobId(job._id);
                if (applicationsResponse.data?.success && applicationsResponse.data?.data) {
                  applicationsCount = applicationsResponse.data.data.length;
                }
              } catch (error) {
                console.log(`No applications found for job ${job._id}`);
              }

              // Calculate remaining days
              const endDate = new Date(job.endDate);
              const today = new Date();
              const timeDiff = endDate.getTime() - today.getTime();
              const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
              
              let remaining;
              if (daysDiff > 0) {
                remaining = `${daysDiff} days remaining`;
              } else if (daysDiff === 0) {
                remaining = 'Expires today';
              } else {
                remaining = 'Expired';
              }

              return {
                key: job._id,
                job: job.title,
                type: job.jobType || 'Full Time',
                remaining: remaining,
                status: job.isActive ? 'Active' : 'Inactive',
                applications: applicationsCount,
                jobData: job
              };
            })
          );

          setJobsData(processedJobs);

          // Calculate statistics
          const activeJobs = jobs.filter(job => job.isActive).length;
          const totalApps = processedJobs.reduce((sum, job) => sum + job.applications, 0);
          
          setStatistics({
            openJobs: activeJobs,
            totalApplications: totalApps
          });
        }
      } catch (error) {
        console.error('Error fetching recruiter data:', error);
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, [user?.userId]);

  // Action handlers
  const handleViewApplications = (record) => {
    console.log('handleViewApplications called with record:', record);
    console.log('record.key (jobId):', record.key);
    console.log('record.job (jobTitle):', record.job);
    
    navigate(ROUTER.RECRUITER_APPLICATIONS, { 
      state: { jobId: record.key, jobTitle: record.job } 
    });
  };

  const handleViewJobDetail = (record) => {
    navigate(`/jobs/${record.key}`);
  };

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
      onClick: () => handleViewJobDetail(record)
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
          color={status === 'Active' ? 'green' : status === 'Inactive' ? 'orange' : 'red'}
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
            onClick={() => handleViewApplications(record)}
          >
            View Applications
          </Button>
          <Dropdown
            menu={{ 
              items: getActionItems(record),
              onClick: ({ key }) => {
                if (key === 'view') {
                  handleViewJobDetail(record);
                } else {
                  console.log(`Action ${key} clicked for job ${record.job}`);
                }
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
          Hello, {user?.firstName || user?.fullName || 'Recruiter'}
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
              value={statistics.openJobs}
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
                   <UserOutlined style={{ color: '#10b981' }} />
                   <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Applications</span>
                 </div>
               }
              value={statistics.totalApplications}
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
        />
      </Card>
    </div>
  );
};

export default RecruiterOverview;
