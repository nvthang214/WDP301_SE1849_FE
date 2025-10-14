import React from "react";
import { Input, Button, Select, Form, Typography, Alert, Card, Divider } from "antd";
import {
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function AccountSettingPage() {
  const [form] = Form.useForm();

  return (
    <div style={{ maxWidth: 800, padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-8">
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Account Settings</Title>
        <Paragraph style={{ color: '#6b7280', margin: 0 }}>
          Manage your contact information and account security
        </Paragraph>
      </div>

      {/* Contact Information Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <PhoneOutlined style={{ color: '#3b82f6' }} />
            <span style={{ color: '#374151', fontWeight: 600 }}>Contact Information</span>
          </div>
        }
        className="mb-6 shadow-sm border border-gray-200"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={
              <span className="font-medium text-gray-700">Map Location</span>
            }
          >
            <div
              style={{
                height: 160,
                background: "#f8fafc",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
              }}
            >
              <EnvironmentOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
              Location Map Preview
            </div>
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Phone Number</span>}
          >
            <Input
              addonBefore={
                <Select defaultValue="+84" style={{ width: 100 }} className="font-medium">
                  <Option value="+84">+84</Option>
                  <Option value="+1">+1</Option>
                  <Option value="+44">+44</Option>
                </Select>
              }
              placeholder="Enter your phone number..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-medium text-gray-700">Email Address</span>}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email address"
              size="large"
            />
          </Form.Item>

          <Button type="primary" size="large" style={{ background: '#3b82f6', borderColor: '#3b82f6' }}>
            Save Changes
          </Button>
        </Form>
      </Card>

      {/* Change Password Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <LockOutlined style={{ color: '#3b82f6' }} />
            <span style={{ color: '#374151', fontWeight: 600 }}>Change Password</span>
          </div>
        }
        className="mb-6 shadow-sm border border-gray-200"
      >
        <Form layout="vertical">
          <Form.Item label={<span className="font-medium text-gray-700">Current Password</span>}>
            <Input.Password
              placeholder="Enter current password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              prefix={<LockOutlined className="text-gray-400" />}
              size="large"
            />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-gray-700">New Password</span>}>
            <Input.Password
              placeholder="Enter new password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              prefix={<LockOutlined className="text-gray-400" />}
              size="large"
            />
          </Form.Item>
          <Form.Item label={<span className="font-medium text-gray-700">Confirm Password</span>}>
            <Input.Password
              placeholder="Confirm new password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              prefix={<LockOutlined className="text-gray-400" />}
              size="large"
            />
          </Form.Item>
          <Button type="primary" size="large" style={{ background: '#3b82f6', borderColor: '#3b82f6' }}>
            Change Password
          </Button>
        </Form>
      </Card>

      {/* Delete Account Card */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <DeleteOutlined style={{ color: '#ef4444' }} />
            <span style={{ color: '#374151', fontWeight: 600 }}>Delete Your Company</span>
          </div>
        }
        className="shadow-sm border border-red-200"
      >
        <Paragraph type="secondary" style={{ fontSize: '14px', lineHeight: '1.5' }}>
          If you delete your JobPilot account, you will lose all your saved jobs,
          matched info, and more. This action cannot be undone.
        </Paragraph>

        <Alert
          message="Warning: This action is permanent"
          description="All your data will be permanently deleted and cannot be recovered."
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
          style={{
            marginBottom: 16,
            border: '1px solid #fecaca',
            background: '#fef2f2'
          }}
        />

        <Button
          danger
          size="large"
          icon={<DeleteOutlined />}
          style={{
            // background: '#ef4444',
            // borderColor: '#ef4444',
            fontWeight: 500
          }}
        >
          Delete Account
        </Button>
      </Card>
    </div>
  );
}