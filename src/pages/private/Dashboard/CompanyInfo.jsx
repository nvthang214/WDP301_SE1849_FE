import React, { useState } from "react";
import { Button, Input, Upload, Typography, Space, Card, Divider } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  PictureOutlined,
  ShopOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function CompanyInfoPage() {
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  return (
    <div style={{ maxWidth: 800, padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Company Information</Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Manage your company profile and branding
        </Text>
      </div>

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
          <div>
            <Text strong className="block mb-2 text-gray-700">Company Name</Text>
            <Input
              placeholder="Enter company name"
              size="large"
              style={{ maxWidth: '400px' }}
              prefix={<ShopOutlined className="text-gray-400" />}
            />
          </div>

          <div>
            <Text strong className="block mb-2 text-gray-700">About Us</Text>
            <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", overflow: 'hidden' }}>
              {/* Toolbar */}
              <div style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", background: '#f9fafb' }}>
                <Space>
                  <Button
                    icon={<BoldOutlined />}
                    type="text"
                    className="hover:bg-gray-200"
                  />
                  <Button
                    icon={<ItalicOutlined />}
                    type="text"
                    className="hover:bg-gray-200"
                  />
                  <Button
                    icon={<UnderlineOutlined />}
                    type="text"
                    className="hover:bg-gray-200"
                  />
                  <Divider type="vertical" />
                  <Button
                    icon={<EditOutlined />}
                    type="text"
                    className="hover:bg-gray-200"
                  >
                    Insert Link
                  </Button>
                </Space>
              </div>

              {/* Textarea */}
              <textarea
                placeholder="Tell us about your company..."
                style={{
                  width: "100%",
                  minHeight: "200px",
                  padding: "16px",
                  border: "none",
                  outline: "none",
                  resize: "vertical",
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              />
            </div>
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
              Describe your company culture, mission, and values
            </Text>
          </div>
        </div>
      </Card>

      <Button
        type="primary"
        size="large"
        style={{ background: '#3b82f6', borderColor: '#3b82f6', fontWeight: 500 }}
      >
        Save Changes
      </Button>
    </div>
  );
}