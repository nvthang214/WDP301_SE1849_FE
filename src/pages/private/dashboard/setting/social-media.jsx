import React from "react";

import { Button, Input, Select, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PlusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export default function SocialMediaPage() {
  return (
    <div style={{ maxWidth: 600 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <label>Social Link {i}</label>
          <Space style={{ width: "100%" }}>
            <Select defaultValue="facebook" style={{ width: 150 }}>
              <Option value="facebook">
                <FacebookOutlined style={{ color: "#1877f2" }} /> Facebook
              </Option>
              <Option value="twitter">
                <TwitterOutlined style={{ color: "#1da1f2" }} /> Twitter
              </Option>
              <Option value="instagram">
                <InstagramOutlined style={{ color: "#d6249f" }} /> Instagram
              </Option>
              <Option value="youtube">
                <YoutubeOutlined style={{ color: "red" }} /> Youtube
              </Option>
            </Select>
            <Input placeholder="Profile link / URL..." />
            <Button icon={<CloseOutlined />} />
          </Space>
        </div>
      ))}

      <Button
        type="dashed"
        icon={<PlusCircleOutlined />}
        style={{ width: "100%", marginBottom: 16 }}
      >
        Add New Social Link
      </Button>

      <Button type="primary">Save Changes</Button>
    </div>
  );
}
