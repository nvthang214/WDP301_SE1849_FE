import React, { useState, useEffect } from "react";
import { Button, Input, Upload, Typography, Space, Card, Divider, Select, DatePicker, Form, message, Spin } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  PictureOutlined,
  ShopOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import { CompanyService } from "../../../../services/CompanyService";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

export default function CompanyInfoPage() {
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyData, setCompanyData] = useState(null);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData._id;
      }
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.id;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return null;
  };

  // Load company data
  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        message.error('Không thể lấy thông tin người dùng');
        return;
      }

      const response = await CompanyService.getCompanyByRecruiter(userId);
      if (response.success && response.data) {
        setCompanyData(response.data);
        // Populate form with company data
        form.setFieldsValue({
          name: response.data.name,
          description: response.data.description,
          industry: response.data.industry,
          teamSize: response.data.teamSize,
          foundedDate: response.data.foundedDate ? dayjs(response.data.foundedDate) : null,
          website: response.data.contact?.website,
          vision: response.data.vision,
          email: response.data.contact?.email,
          phone: response.data.contact?.phone,
          address: response.data.address,
        });
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      // If no company exists yet, that's okay - user can create one
      if (error.response?.status !== 404) {
        message.error('Không thể tải thông tin công ty');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSave = async (values) => {
    try {
      setSaving(true);
      const userId = getUserId();
      if (!userId) {
        message.error('Không thể lấy thông tin người dùng');
        return;
      }

      const companyPayload = {
        name: values.name,
        description: values.description,
        industry: values.industry,
        teamSize: parseInt(values.teamSize) || 1,
        foundedDate: values.foundedDate ? values.foundedDate.format('YYYY-MM-DD') : null,
        vision: values.vision,
        contact: {
          website: values.website,
          email: values.email,
          phone: values.phone,
        },
        address: values.address,
      };

      let response;
      if (companyData && companyData._id) {
        // Update existing company
        response = await CompanyService.updateCompany(companyData._id, companyPayload);
      } else {
        // Create new company
        response = await CompanyService.createCompany(companyPayload);
      }

      if (response.success) {
        message.success('Thông tin công ty đã được lưu thành công!');
        setCompanyData(response.data);
        // Reload data to get the latest information
        await loadCompanyData();
      } else {
        message.error('Có lỗi xảy ra khi lưu thông tin công ty');
      }
    } catch (error) {
      console.error('Error saving company data:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin công ty');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadCompanyData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Thông tin công ty</Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Quản lý hồ sơ và thương hiệu công ty của bạn
        </Text>
      </div>

      <Form form={form} onFinish={handleSave} layout="vertical">

      {/* Logo & Banner Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <PictureOutlined style={{ color: '#3b82f6' }} />
            <span style={{ color: '#374151', fontWeight: 600 }}>Logo & Banner Image</span>
          </div>
        }
        className="mb-6 shadow-sm border border-gray-200"
      >
        <div className="space-y-6">
          <div className="flex gap-6">
            {/* Logo Upload */}
            <div className="flex-1">
              <Text strong className="block mb-3 text-gray-700">Company Logo</Text>
              <Upload
                listType="picture-card"
                maxCount={1}
                onChange={(info) => setLogo(info.file)}
                className="custom-upload"
              >
                {logo ? (
                  <div className="text-center">
                    <div>Replace Logo</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Recommended: 200x200px</Text>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
                    <div>Upload Logo</div>
                  </div>
                )}
              </Upload>
            </div>

            {/* Banner Upload */}
            <div className="flex-1">
              <Text strong className="block mb-3 text-gray-700">Cover Banner</Text>
              <Upload
                listType="picture-card"
                maxCount={1}
                onChange={(info) => setBanner(info.file)}
                style={{ width: '100%', height: '120px' }}
              >
                {banner ? (
                  <div className="text-center">
                    <div>Replace Banner</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Recommended: 1200x300px</Text>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadOutlined style={{ fontSize: '20px', marginBottom: '8px' }} />
                    <div>Upload Banner</div>
                  </div>
                )}
              </Upload>
            </div>
          </div>
        </div>
      </Card>

      {/* Company Details Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <ShopOutlined style={{ color: '#3b82f6' }} />
            <span style={{ color: '#374151', fontWeight: 600 }}>Company Details</span>
          </div>
        }
        className="mb-6 shadow-sm border border-gray-200"
      >
        <div className="space-y-6">
          <Form.Item
            name="name"
            label={<Text strong className="text-gray-700">Tên công ty</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
          >
            <Input
              placeholder="Nhập tên công ty"
              size="large"
              style={{ maxWidth: '400px' }}
              prefix={<ShopOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<Text strong className="text-gray-700">Giới thiệu về chúng tôi</Text>}
          >
            <Input.TextArea
              placeholder="Hãy kể cho chúng tôi về công ty của bạn..."
              rows={8}
              style={{ fontSize: '14px', lineHeight: '1.5' }}
            />
          </Form.Item>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '-16px', display: 'block' }}>
            Mô tả văn hóa, sứ mệnh và giá trị của công ty bạn
          </Text>
        </div>
      </Card>

      <div style={{ padding: '24px 0' }}>
        {/* Industry Types, Team Size */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Form.Item 
              name="industry"
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Loại ngành nghề</span>}
            >
              <Input
                placeholder="Nhập ngành nghề..."
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
  
            <Form.Item 
              name="teamSize"
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Quy mô nhân sự</span>}
            >
              <Input
                type="number"
                placeholder="Nhập số lượng nhân viên..."
                size="large"
                style={{ width: '100%' }}
                min={1}
              />
            </Form.Item>
          </div>
        </div>
  
        {/* Year of Establishment and Company Website */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <Form.Item 
              name="foundedDate"
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Năm thành lập</span>}
            >
              <DatePicker 
                placeholder="dd/mm/yyyy"
                size="large"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
  
            <Form.Item 
              name="website"
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Website công ty</span>}
            >
              <Input
                placeholder="https://example.com"
                size="large"
                prefix={<GlobalOutlined style={{ color: '#9ca3af' }} />}
              />
            </Form.Item>
          </div>
        </div>
  
        {/* Company Vision */}
        <Form.Item
          name="vision"
          label={<Text strong style={{ color: '#374151', fontWeight: 500 }}>Tầm nhìn công ty</Text>}
          style={{ marginBottom: '32px' }}
        >
          <Input.TextArea
            placeholder="Hãy chia sẻ tầm nhìn của công ty bạn..."
            rows={5}
            style={{ fontSize: '14px', lineHeight: '1.5' }}
          />
        </Form.Item>
  
        {/* Save Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            style={{ 
              background: '#3b82f6', 
              borderColor: '#3b82f6', 
              fontWeight: 500 
            }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Form.Item>

         {/* Additional Contact Information */}
         <div style={{ marginBottom: '32px' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <Form.Item 
               name="email"
               label={<span style={{ fontWeight: 500, color: '#374151' }}>Email liên hệ</span>}
             >
               <Input
                 placeholder="contact@company.com"
                 size="large"
                 type="email"
               />
             </Form.Item>
   
             <Form.Item 
               name="phone"
               label={<span style={{ fontWeight: 500, color: '#374151' }}>Số điện thoại</span>}
             >
               <Input
                 placeholder="+84 123 456 789"
                 size="large"
               />
             </Form.Item>
           </div>
         </div>

         {/* Address */}
         <Form.Item
           name="address"
           label={<span style={{ fontWeight: 500, color: '#374151' }}>Địa chỉ công ty</span>}
           style={{ marginBottom: '32px' }}
         >
           <Input.TextArea
             placeholder="Nhập địa chỉ chi tiết của công ty..."
             rows={3}
           />
         </Form.Item>
       </div>
       </Form>
     </div>
   );
 }