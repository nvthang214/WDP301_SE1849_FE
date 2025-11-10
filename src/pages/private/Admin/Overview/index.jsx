import React, { useState, useEffect } from 'react';
import {
  Spin,
  Alert,
  Row,
  Col,
  Card,
  DatePicker
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  BuildOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Line, Column, Area } from '@ant-design/charts';
import { AdminService } from '../../../../services/AdminService';
import dayjs from 'dayjs';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [registrationData, setRegistrationData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const [jobStatsData, setJobStatsData] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [selectedJobYear, setSelectedJobYear] = useState(dayjs());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchRegistrationData();
  }, [selectedYear]);

  useEffect(() => {
    fetchJobData();
  }, [selectedJobYear]);

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

  const fetchJobData = async () => {
    try {
      const year = selectedJobYear.year();

      // Fetch all jobs for the year to calculate monthly stats
      const jobsResponse = await AdminService.getAllJobs({ page: 1, limit: 1000 });
      const allJobs = jobsResponse?.data?.data || jobsResponse?.data || [];

      // Calculate monthly job statistics
      const monthlyStats = [];
      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const activeJobs = allJobs.filter(job => {
          const jobDate = new Date(job.createdAt);
          return jobDate >= startDate && jobDate <= endDate && job.isActive;
        });

        const inactiveJobs = allJobs.filter(job => {
          const jobDate = new Date(job.createdAt);
          return jobDate >= startDate && jobDate <= endDate && !job.isActive;
        });

        monthlyStats.push({
          month: new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'short' }),
          active: activeJobs.length,
          inactive: inactiveJobs.length,
        });
      }

      setJobStatsData(monthlyStats);

      // Fetch latest active jobs (only 5)
      const latestJobsResponse = await AdminService.getAllJobs({ page: 1, limit: 100, status: 'active' });
      const allLatestJobs = latestJobsResponse?.data?.data || latestJobsResponse?.data || [];
      // Filter only active jobs and sort by createdAt descending, then take 5
      const activeLatestJobs = allLatestJobs
        .filter(job => job.isActive)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setLatestJobs(activeLatestJobs);
    } catch (err) {
      console.error('Error fetching job data:', err);
    }
  };

  const handleYearChange = (date) => {
    if (date) {
      setSelectedYear(date);
    }
  };

  const handleJobYearChange = (date) => {
    if (date) {
      setSelectedJobYear(date);
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

  // Prepare job chart data for area chart (flattened format)
  const jobChartData = jobStatsData.flatMap(item => [
    { month: item.month, type: 'Active Jobs', value: item.active },
    { month: item.month, type: 'Inactive Jobs', value: item.inactive },
  ]);

  const jobAreaConfig = {
    data: jobChartData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    areaStyle: {
      fillOpacity: 0.6,
    },
    legend: {
      position: 'top',
    },
    color: ['#4facfe', '#ff6b6b'],
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
    <div className="p-6">
      <Row gutter={[24, 24]}>
        {/* Total Users Card */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>
                  TOTAL USERS
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1' }}>
                  {stats?.users?.total || 0}
                </div>
              </div>
              <UserOutlined style={{ fontSize: '48px', opacity: 0.3, position: 'absolute', top: '16px', right: '16px' }} />
            </div>
          </div>
        </Col>

        {/* Total Requests Card */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>
                  TOTAL REQUESTS
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1' }}>
                  {stats?.upgradeRequests?.total || 0}
                </div>
              </div>
              <FileTextOutlined style={{ fontSize: '48px', opacity: 0.3, position: 'absolute', top: '16px', right: '16px' }} />
            </div>
          </div>
        </Col>

        {/* Total Jobs Card */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>
                  TOTAL JOBS
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1' }}>
                  {stats?.jobs?.total || 0}
                </div>
              </div>
              <ShoppingOutlined style={{ fontSize: '48px', opacity: 0.3, position: 'absolute', top: '16px', right: '16px' }} />
            </div>
          </div>
        </Col>

        {/* Total Companies Card */}
        <Col xs={24} sm={12} lg={6}>
          <div
            style={{
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px', fontWeight: 500 }}>
                  TOTAL COMPANIES
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1' }}>
                  {stats?.companies?.total || 0}
                </div>
              </div>
              <BuildOutlined style={{ fontSize: '48px', opacity: 0.3, position: 'absolute', top: '16px', right: '16px' }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Job Statistics Section */}
      <div className="mt-8">
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
            padding: '20px 24px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="flex items-center justify-between"
        >
          <div style={{ position: 'relative', zIndex: 1 }} className="flex items-center">
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ShoppingOutlined style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'white' }}>
                Job Statistics
              </h2>
              <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.9)' }}>
                Track job creation trends over time
              </p>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <DatePicker
              picker="year"
              value={selectedJobYear}
              onChange={handleJobYearChange}
              style={{
                width: 150,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px'
              }}
              size="large"
              format="YYYY"
              allowClear={false}
            />
          </div>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: 0
          }}></div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              className="shadow-sm rounded-lg border border-gray-300"
              title={
                <div className="flex items-center justify-between">
                  <span>Job Creation by Month</span>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#4facfe', borderRadius: '2px' }}></div>
                      <span>Active Jobs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#ff6b6b', borderRadius: '2px' }}></div>
                      <span>Inactive Jobs</span>
                    </div>
                  </div>
                </div>
              }
              bodyStyle={{
                height: '368px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Area {...jobAreaConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              className="shadow-sm rounded-lg border border-gray-300"
              title={
                <span className="font-bold text-gray-800">Latest Jobs</span>
              }
              bodyStyle={{
                height: '368px',
                display: 'flex',
                flexDirection: 'column',
                padding: '16px'
              }}
            >
              <div className="flex flex-col h-full space-y-3">
                {latestJobs.length > 0 ? (
                  latestJobs.map((job, index) => {
                    const rank = index + 1;
                    const isTopThree = rank <= 3;
                    const badgeClass = isTopThree
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600";

                    return (
                      <div
                        key={job._id || index}
                        className="flex items-center gap-3 py-2.5 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                      >
                        <div
                          className={`flex items-center justify-center w-7 h-7 rounded-full font-semibold text-xs flex-shrink-0 ${badgeClass}`}
                        >
                          {rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-800 mb-1 line-clamp-1 text-xs">
                            {job.title || 'Untitled Job'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {job.company?.name || 'No Company'}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-8 flex-1 flex items-center justify-center text-xs">No jobs found</div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* User Registration Charts Section */}
      <div className="mt-8">
        <div
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(79, 172, 254, 0.3)',
            padding: '20px 24px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="flex items-center justify-between"
        >
          <div style={{ position: 'relative', zIndex: 1 }} className="flex items-center">
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <TeamOutlined style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'white' }}>
                User Registration by Month
              </h2>
              <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.9)' }}>
                Monitor new user sign-ups throughout the year
              </p>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <DatePicker
              picker="year"
              value={selectedYear}
              onChange={handleYearChange}
              style={{
                width: 150,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px'
              }}
              size="large"
              format="YYYY"
              allowClear={false}
            />
          </div>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: 0
          }}></div>
        </div>

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
    </div>
  );

};

export default AdminOverview;
