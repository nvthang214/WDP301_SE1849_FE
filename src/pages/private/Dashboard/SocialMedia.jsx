import React from "react";
import { Button, Input, Select, Space, Card, Typography } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  ShareAltOutlined,
  LinkOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// Tạo component LinkedIn icon đơn giản
const LinkedInOutlined = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function SocialMediaPage() {
  return (
    <div style={{ maxWidth: 600, padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Social Media</Title>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Manage your company's social media links
        </Text>
      </div>

      {/* Social Links Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <ShareAltOutlined style={{ color: '#3b82f6' }} />
            <span style={{ color: '#374151', fontWeight: 600 }}>Social Media Links</span>
          </div>
        }
        className="mb-6 shadow-sm border border-gray-200"
      >
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="social-link-item">
              <Text strong className="block mb-2 text-gray-700">Social Link {i}</Text>
              <Space.Compact style={{ width: '100%' }} size="large">
                <Select
                  defaultValue="facebook"
                  style={{ width: '150px' }}
                  className="social-select"
                >
                  <Option value="facebook">
                    <div className="flex items-center gap-2">
                      <FacebookOutlined style={{ color: "#1877f2" }} />
                      <span>Facebook</span>
                    </div>
                  </Option>
                  <Option value="twitter">
                    <div className="flex items-center gap-2">
                      <TwitterOutlined style={{ color: "#1da1f2" }} />
                      <span>Twitter</span>
                    </div>
                  </Option>
                  <Option value="instagram">
                    <div className="flex items-center gap-2">
                      <InstagramOutlined style={{ color: "#d6249f" }} />
                      <span>Instagram</span>
                    </div>
                  </Option>
                  <Option value="youtube">
                    <div className="flex items-center gap-2">
                      <YoutubeOutlined style={{ color: "red" }} />
                      <span>YouTube</span>
                    </div>
                  </Option>
                  <Option value="linkedin">
                    <div className="flex items-center gap-2">
                      <LinkedInOutlined />
                      <span>LinkedIn</span>
                    </div>
                  </Option>
                </Select>
                <Input
                  placeholder="https://..."
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
                <Button
                  icon={<CloseOutlined />}
                  danger
                  style={{ background: '#fef2f2', borderColor: '#fecaca' }}
                />
              </Space.Compact>
            </div>
          ))}

          {/* Add New Button */}
          <Button
            type="dashed"
            icon={<PlusCircleOutlined />}
            style={{
              width: "100%",
              height: '48px',
              borderColor: '#d1d5db',
              color: '#6b7280',
              fontSize: '14px'
            }}
            className="hover:border-blue-500 hover:text-blue-500"
          >
            Add New Social Link
          </Button>
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