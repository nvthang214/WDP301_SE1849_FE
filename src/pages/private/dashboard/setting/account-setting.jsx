import React from "react";
import { useState } from "react";
import { Input, Button, Select, Form, Typography, Alert } from "antd";

import {
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Option } = Select;

export default function AccountSettingPage() {
  const [form] = Form.useForm();

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Contact Info */}
      <Title level={4}>Contact Information</Title>
      <Form form={form} layout="vertical">
        <Form.Item label="Map Location">
          <div
            style={{
              height: 120,
              background: "#f5f5f5",
              borderRadius: 8,
            }}
          ></div>
        </Form.Item>

        <Form.Item label="Phone">
          <Input
            addonBefore={
              <Select defaultValue="+84" style={{ width: 100 }}>
                <Option value="+84">+84</Option>
                <Option value="+1">+1</Option>
                <Option value="+44">+44</Option>
              </Select>
            }
            placeholder="Phone number..."
          />
        </Form.Item>

        <Form.Item label="Email">
          <Input prefix={<MailOutlined />} placeholder="Email address" />
        </Form.Item>

        <Button type="primary">Save Changes</Button>
      </Form>

      {/* Change Password */}
      <div style={{ marginTop: 32 }}>
        <Title level={4}>Change Password</Title>
        <Form layout="vertical">
          <Form.Item label="Current Password">
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item label="New Password">
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item label="Confirm Password">
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Button type="primary">Change Password</Button>
        </Form>
      </div>

      {/* Delete Account */}
      <div style={{ marginTop: 32 }}>
        <Title level={4}>Delete Your Company</Title>
        <Paragraph type="secondary">
          If you delete your Jobpilot account, you will lose all your saved jobs,
          matched info, and more.
        </Paragraph>
        <Alert
          message="Close Account"
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Button danger>Delete Account</Button>
      </div>
    </div>
  );
}
