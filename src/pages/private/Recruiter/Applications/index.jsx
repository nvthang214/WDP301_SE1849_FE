import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Button, Dropdown, Menu, Avatar, Typography, Spin, message, Empty } from 'antd';
import {
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  MoreOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { ApplicationService } from '../../../../services/ApplicationService';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Get jobId from URL params
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      // Fetch all applications for the job
      const allApplicationsResponse = await ApplicationService.getApplicationsByJobId(jobId);
      const allApps = allApplicationsResponse.data || allApplicationsResponse || [];
      
      // Separate applications by status
      const regularApps = allApps.filter(app => app.status !== 'shortlisted');
      const shortlistedApps = allApps.filter(app => app.status === 'shortlisted');
      
      setApplications(regularApps);
      setShortlistedApplications(shortlistedApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await ApplicationService.updateApplicationStatus(applicationId, newStatus);
      message.success('Cập nhật trạng thái thành công');
      fetchApplications(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const sortMenu = (
    <Menu
      items={[
        { key: "newest", label: "Newest" },
        { key: "oldest", label: "Oldest" },
      ]}
    />
  );

  const columnMenu = (
    <Menu
      items={[
        { key: "edit", label: "Edit Column" },
        { key: "delete", label: "Delete" },
      ]}
    />
  );

  const ApplicationCard = ({ application, showShortlistButton = true }) => {
    const candidate = application.candidate;
    const appliedDate = new Date(application.createdAt).toLocaleDateString('vi-VN');
    
    const actionMenu = (
      <Menu
        items={[
          {
            key: 'shortlist',
            label: 'Shortlist',
            onClick: () => handleStatusUpdate(application._id, 'shortlisted'),
            disabled: application.status === 'shortlisted'
          },
          {
            key: 'reject',
            label: 'Reject',
            onClick: () => handleStatusUpdate(application._id, 'rejected'),
            disabled: application.status === 'rejected'
          },
          {
            key: 'pending',
            label: 'Mark as Pending',
            onClick: () => handleStatusUpdate(application._id, 'pending'),
            disabled: application.status === 'pending'
          }
        ]}
      />
    );

    return (
      <Card
        className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl mb-6"
        bodyStyle={{ padding: '16px 20px' }}
        actions={[
          <Button type="link" className="text-blue-600 hover:text-blue-800">
            Download CV
          </Button>,
          <Dropdown overlay={actionMenu} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        ]}
      >
        <div className="flex items-center mb-3">
          <Avatar
            src={candidate?.avatar}
            icon={<UserOutlined />}
            size={48}
            className="mr-4 border border-gray-200"
          />
          <div>
            <h4 className="font-semibold text-base">
              {candidate?.firstName} {candidate?.lastName}
            </h4>
            <p className="text-gray-500 text-sm">{candidate?.email}</p>
          </div>
        </div>

        <ul className="text-gray-600 text-sm space-y-1 mb-2">
          <li>• Phone: {candidate?.phoneNumber || 'N/A'}</li>
          <li>• Status: <span className={`font-medium ${
            application.status === 'shortlisted' ? 'text-green-600' :
            application.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
          }`}>{application.status}</span></li>
          <li>• Applied: {appliedDate}</li>
        </ul>
      </Card>
    );
  };

  return (
    <Layout className="rounded-xl bg-white p-8 shadow-lg">
      <Content>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <div className="flex space-x-3">
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Dropdown overlay={sortMenu} placement="bottomRight">
              <Button icon={<SortAscendingOutlined />}>Sort</Button>
            </Dropdown>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          /* Columns */
          <Row gutter={24}>
            {/* All Applications */}
            <Col span={12}>
              <Card
                title={`All Applications (${applications.length})`}
                className="rounded-2xl shadow-lg"
                headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
                bodyStyle={{ paddingTop: '16px' }}
              >
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                      showShortlistButton={true}
                    />
                  ))
                ) : (
                  <Empty 
                    description="Chưa có ứng viên nào apply cho job này"
                    className="my-8"
                  />
                )}
              </Card>
            </Col>

            {/* Shortlisted */}
            <Col span={12}>
              <Card
                title={
                  <div className="flex justify-between items-center">
                    <span>Shortlisted ({shortlistedApplications.length})</span>
                    <Dropdown overlay={columnMenu} placement="bottomRight">
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                }
                className="rounded-2xl shadow-lg"
                headStyle={{ borderBottom: 'none', paddingBottom: 0 }}
                bodyStyle={{ paddingTop: '16px' }}
              >
                {shortlistedApplications.length > 0 ? (
                  shortlistedApplications.map((application) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                      showShortlistButton={false}
                    />
                  ))
                ) : (
                  <Empty 
                    description="Chưa có ứng viên nào được shortlist"
                    className="my-8"
                  />
                )}

                {/* Create New Column Button */}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  className="w-full h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-500 hover:text-blue-600 mt-4"
                >
                  Create New Column
                </Button>
              </Card>
            </Col>
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default Applications;
