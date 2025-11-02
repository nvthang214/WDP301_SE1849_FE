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
  Form
} from 'antd';
import { notifySuccess, notifyError } from '../../../../components/Notification';
import {
  FolderOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { CategoryService } from '../../../../services/CategoryService';

const { Search } = Input;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
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
  const [selectedCategory, setSelectedCategory] = useState(null);

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

      const response = await CategoryService.getAllCategories(params);

      const normalize = (res) => {
        if (!res) return [];
        const d = res.data;
        if (Array.isArray(d)) return d;
        if (Array.isArray(d?.data)) return d.data;
        if (Array.isArray(d?.categories)) return d.categories;
        if (Array.isArray(d?.items)) return d.items;
        return [];
      };

      const categoriesData = normalize(response);
      const paginationData = response?.pagination || {};

      // Update pagination from backend
      if (paginationData.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: paginationData.total || 0,
        }));
      }

      setCategories(categoriesData);

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
      await CategoryService.createCategory(values);
      notifySuccess('Category created successfully!');
      setIsModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      console.error('Error creating category:', err);
      notifyError(err?.response?.data?.msg || 'Failed to create category. Please try again.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await CategoryService.updateCategory(selectedCategory._id, values);
      notifySuccess('Category updated successfully!');
      setIsModalVisible(false);
      setIsEditing(false);
      setSelectedCategory(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      console.error('Error updating category:', err);
      notifyError(err?.response?.data?.msg || 'Failed to update category. Please try again.');
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await CategoryService.deleteCategory(categoryId);
      notifySuccess('Category deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting category:', err);
      notifyError(err?.response?.data?.msg || 'Failed to delete category. Please try again.');
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description || '',
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
    setSelectedCategory(null);
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <span className={text ? 'text-gray-800' : 'text-gray-400 italic'}>
          {text || 'No description'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            className="text-xs"
          >
            Edit
          </Button>

          <Popconfirm
            title="Confirm Delete Category"
            description={`Are you sure you want to delete category "${record.name}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="text-xs"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && categories.length === 0) {
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
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} className="shadow-sm rounded-lg border border-gray-300">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Categories</span>}
              value={pagination.total}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#1677ff', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md mb-6 p-5 flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center mb-0">
          <FolderOutlined className="mr-3 text-3xl text-white" />
          Category Management
        </h1>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="bg-white text-blue-600 hover:bg-gray-100 border-0"
        >
          Create Category
        </Button>
      </div>

      {/* Filter + Table Section */}
      <div className="p-0">
        {/* Search & Filters */}
        <div className="mb-6">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search by name or description..."
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
          </Row>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={categories}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
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
            <span>{isEditing ? 'Edit Category' : 'Create Category'}</span>
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
          name="categoryForm"
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: 'Please enter category name' },
              { min: 2, message: 'Category name must be at least 2 characters' }
            ]}
          >
            <Input placeholder="Enter category name" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 500, message: 'Description must not exceed 500 characters' }
            ]}
          >
            <Input.TextArea
              placeholder="Enter category description (optional)"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;

