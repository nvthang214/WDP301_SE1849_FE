import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Popconfirm,
  Card,
  Input,
  Row,
  Col,
  Spin,
  Alert,
  Statistic,
  Form,
  Tooltip
} from 'antd';
import { notifySuccess, notifyError } from '../../../../components/Notification';
import {
  TagOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { TagService } from '../../../../services/TagService';

const { Search } = Input;

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Track filters to detect changes
  const prevFiltersRef = React.useRef(searchText);

  // Fetch data when pagination or search changes
  useEffect(() => {
    const filtersKey = searchText;
    if (filtersKey !== prevFiltersRef.current) {
      prevFiltersRef.current = filtersKey;
      if (pagination.current !== 1) {
        setPagination(prev => ({ ...prev, current: 1 }));
        return;
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, searchText]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
      };

      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      const response = await TagService.getAllTags(params);

      const normalize = (res) => {
        if (!res) return [];
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        if (Array.isArray(d?.tags)) return d.tags;
        if (Array.isArray(d?.items)) return d.items;
        return [];
      };

      const tagsData = normalize(response);
      const paginationData = response?.pagination || {};

      // Update pagination from backend
      if (paginationData.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: paginationData.total || 0,
        }));
      }

      setTags(tagsData);

    } catch (err) {
      console.error('Error fetching data:', err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError('Session expired or insufficient permissions. Please log in again with an admin account.');
      } else {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await TagService.createTag(values);
      notifySuccess('Tag created successfully!');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      console.error('Error creating tag:', err);
      notifyError(err?.response?.data?.msg || 'Failed to create tag. Please try again.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await TagService.updateTag(selectedTag._id, values);
      notifySuccess('Tag updated successfully!');
      setIsModalVisible(false);
      setIsEditing(false);
      setSelectedTag(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      console.error('Error updating tag:', err);
      notifyError(err?.response?.data?.msg || 'Failed to update tag. Please try again.');
    }
  };

  const handleDelete = async (tagId) => {
    try {
      await TagService.deleteTag(tagId);
      notifySuccess('Tag deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting tag:', err);
      notifyError(err?.response?.data?.msg || 'Failed to delete tag. Please try again.');
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (tag) => {
    setIsEditing(true);
    setSelectedTag(tag);
    form.setFieldsValue({
      name: tag.name,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (isEditing) {
        handleUpdate(values);
      } else {
        handleCreate(values);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setSelectedTag(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="font-medium">{text || 'N/A'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Edit">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
              className="text-xs"
            />
          </Tooltip>

          <Popconfirm
            title="Confirm Delete Tag"
            description={`Are you sure you want to delete tag "${record.name}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="text-xs"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && tags.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
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

  return (
    <div className="p-0 m-0">
      {/* Banner Header */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(250, 112, 154, 0.3)',
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
            <TagOutlined style={{ fontSize: '28px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'white' }}>
              Tag Management
            </h1>
            <p style={{ fontSize: '14px', margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.9)' }}>
              Create and manage job tags
            </p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
          >
            Create Tag
          </Button>
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

      {/* Filter + Table Section */}
      <div className="p-0">
        {/* Search & Filters */}
        <div className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search by tag name..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchInput}
                onSearch={(value) => {
                  setSearchText(value);
                  setPagination(prev => ({ ...prev, current: 1 }));
                }}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Button
                size="large"
                onClick={() => {
                  setSearchInput('');
                  setSearchText('');
                  setPagination(prev => ({ ...prev, current: 1 }));
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </Col>

            <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <span className="text-gray-700 font-medium" style={{ whiteSpace: 'nowrap' }}>
                Total Tags : {pagination.total}
              </span>
            </Col>
          </Row>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="_id"
          bordered
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
            onShowSizeChange: (current, size) => {
              setPagination(prev => ({
                ...prev,
                current: 1,
                pageSize: size,
              }));
            },
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tags`,
            pageSizeOptions: ['10', '20', '50', '100'],
            position: ['bottomRight'],
          }}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <EditOutlined className="mr-2 text-blue-500" />
            <span>{isEditing ? 'Edit Tag' : 'Create Tag'}</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={isEditing ? 'Update' : 'Create'}
        cancelText="Cancel"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          name="tagForm"
        >
          <Form.Item
            name="name"
            label="Tag Name"
            rules={[
              { required: true, message: 'Please enter tag name' },
              { min: 2, message: 'Tag name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter tag name" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagement;

