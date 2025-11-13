import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Button, Dropdown, Menu, Avatar, Typography, Spin, Empty, Table, Select, Modal } from 'antd';
import {
  FilterOutlined,
  SortAscendingOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ApplicationService } from '../../../../services/ApplicationService';
import { useLocation } from 'react-router-dom';
import { notifySuccess, notifyInfo } from '../../../../components/Notification';

const { Content } = Layout;
const { Title } = Typography;

const allowedStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

const transitionMap = {
  pending: ['shortlisted', 'interview', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['hired', 'rejected'],
  hired: [],
  rejected: [],
};

// Normalize cover letter: remove unnecessary HTML tags and preserve line breaks
const normalizeCoverLetter = (raw) => {
  const input = String(raw || '').trim();
  if (!input) return '';
  // Quick unwrap single <p> wrapper
  const singlePMatch = input.match(/^<p\b[^>]*>([\s\S]*?)<\/p>$/i);
  let cleaned = singlePMatch ? singlePMatch[1] : input;
  // Convert <br> to newline and </p> to double newline, remove <p>
  cleaned = cleaned
    .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, ''); // strip remaining tags
  // Decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = cleaned;
  cleaned = textarea.value;
  // Normalize whitespace
  cleaned = cleaned
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return cleaned;
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [coverModalContent, setCoverModalContent] = useState('');
  const [coverModalTitle, setCoverModalTitle] = useState('Cover Letter');
  const location = useLocation();
  
  // Lấy jobId từ query string
  const searchParams = new URLSearchParams(location.search);
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // Nếu có jobId thì lấy applications cho job cụ thể, không thì lấy tất cả
      const allApplicationsResponse = jobId 
        ? await ApplicationService.getApplicationsByJobId(jobId)
        : await ApplicationService.getAllApplicationsByRecruiter();
      const allApps = allApplicationsResponse.data || allApplicationsResponse || [];
      const regularApps = allApps.filter(app => app.status !== 'shortlisted');
      const shortlistedApps = allApps.filter(app => app.status === 'shortlisted');
      setApplications(regularApps);
      setShortlistedApplications(shortlistedApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Lỗi đã được hiển thị bởi hệ thống notify trong axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await ApplicationService.updateApplicationStatus(applicationId, newStatus);
      notifySuccess('Cập nhật trạng thái thành công');
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      // Lỗi đã được hiển thị bởi hệ thống notify trong axios interceptor
    }
  };

  const handleDownloadCV = async (applicationId, candidate, resumeUrlFallback) => {
    try {
      const blob = await ApplicationService.downloadCvByApplicationId(applicationId);
      const ext = blob.type === 'application/pdf' ? '.pdf' : '';
      const fullName = `${candidate?.firstName || ''}${candidate?.lastName ? ' ' + candidate?.lastName : ''}`.trim();
      const fileName = (fullName ? `${fullName} - CV` : 'cv') + ext;
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      notifySuccess('Đã tải CV của ứng viên');
    } catch (e) {
      // Fallback: mở URL gốc nếu backend không thể stream
      if (resumeUrlFallback) {
        window.open(resumeUrlFallback, '_blank', 'noopener,noreferrer');
        notifyInfo('Không thể tải trực tiếp, đã mở CV để xem');
      }
    }
  };

  const handleViewCoverLetter = (coverLetter, candidate) => {
    if (!coverLetter) return;

    // If coverLetter looks like a URL, open it in a new tab
    if (typeof coverLetter === 'string' && /^https?:\/\//.test(coverLetter)) {
      window.open(coverLetter, '_blank', 'noopener,noreferrer');
      notifyInfo('Mở cover letter');
      return;
    }

    // Otherwise treat it as plain text and show in modal
    try {
      const content = normalizeCoverLetter(coverLetter);
      const fullName = `${candidate?.firstName || ''}${candidate?.lastName ? ' ' + candidate?.lastName : ''}`.trim();
      setCoverModalTitle(fullName ? `${fullName} - Cover Letter` : 'Cover Letter');
      setCoverModalContent(content);
      setCoverModalVisible(true);
    } catch (e) {
      console.error('Error showing cover letter', e);
      notifyInfo('Không thể hiển thị cover letter');
    }
  };

  const sortMenu = (
    <Menu
      items={[
        { key: 'newest', label: 'Newest' },
        { key: 'oldest', label: 'Oldest' },
      ]}
      onClick={({ key }) => setSortOrder(key)}
    />
  );

  const dataSource = useMemo(() => {
    const all = [...shortlistedApplications, ...applications];
    const filtered = filterStatus === 'all' ? all : all.filter(a => a.status === filterStatus);
    const sorted = [...filtered].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return sorted;
  }, [applications, shortlistedApplications, filterStatus, sortOrder]);

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      render: (candidate) => {
        const fullName = `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim();
        const initials = fullName
          .split(' ')
          .map(name => name.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2);
        
        // Parse avatar JSON string to extract URL
        let avatarUrl = null;
        if (candidate?.avatar && candidate.avatar.trim() !== '') {
          try {
            const avatarData = JSON.parse(candidate.avatar);
            avatarUrl = avatarData.url;
          } catch (error) {
            // If parsing fails, treat as direct URL string
            avatarUrl = candidate.avatar;
          }
        }
        
        const hasValidAvatar = avatarUrl && avatarUrl.trim() !== '';
        
        return (
          <div className="flex items-center">
            <Avatar 
              src={hasValidAvatar ? avatarUrl : undefined} 
              size={40} 
              className="mr-3"
              style={{ 
                backgroundColor: hasValidAvatar ? undefined : '#1890ff',
                color: '#fff'
              }}
            >
              {!hasValidAvatar && initials}
            </Avatar>
            <div>
              <div className="font-semibold">{fullName}</div>
              <div className="text-gray-500 text-sm">{candidate?.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Phone',
      dataIndex: ['candidate','phoneNumber'],
      key: 'phoneNumber',
      render: (phone) => phone || 'N/A'
    },
    {
      title: 'CV',
      dataIndex: 'resume',
      key: 'resume',
      render: (resume, record) => resume ? (
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 underline"
          onClick={() => handleDownloadCV(record._id, record.candidate, resume)}
        >
          Download CV
        </button>
      ) : '—'
    },
    {
      title: 'Cover Letter',
      dataIndex: 'coverLetter',
      key: 'coverLetter',
      render: (coverLetter, record) => coverLetter ? (
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 underline"
          onClick={() => handleViewCoverLetter(coverLetter, record.candidate)}
        >
          View
        </button>
      ) : '—'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const current = String(status).toLowerCase();
        const nextAllowed = transitionMap[current] || [];
        const isTerminal = ['hired', 'rejected'].includes(current);
        const optionsForRecord = allowedStatuses.map((opt) => ({
          ...opt,
          disabled: isTerminal || opt.value === current || !nextAllowed.includes(opt.value),
        }));

        return (
          <Select
            size="small"
            value={current}
            onChange={(val) => handleStatusUpdate(record._id, val)}
            options={optionsForRecord}
            style={{ minWidth: 160 }}
            disabled={isTerminal}
          />
        );
      }
    },
    {
      title: 'Application Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
  ];

  return (
    <Layout className="p-8 bg-white rounded-xl shadow-lg">
      <Content>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <div className="flex items-center gap-3">
            <Select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              options={[
                { value: 'all', label: 'All' },
                ...allowedStatuses,
              ]}
              size="middle"
              style={{ minWidth: 160 }}
              suffixIcon={<FilterOutlined />}
            />
            <Dropdown overlay={sortMenu} placement="bottomRight">
              <Button icon={<SortAscendingOutlined />}>Sort</Button>
            </Dropdown>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : dataSource.length === 0 ? (
          <Empty description="No candidates have applied for this job yet" className="my-8" />
        ) : (
          <>
            <Table
            rowKey={(record) => record._id}
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 10 }}
            />

            <Modal
              visible={coverModalVisible}
              title={coverModalTitle}
              onCancel={() => setCoverModalVisible(false)}
              footer={null}
              width={800}
            >
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit' }}>
                  {coverModalContent}
                </pre>
              </div>
            </Modal>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default Applications;
