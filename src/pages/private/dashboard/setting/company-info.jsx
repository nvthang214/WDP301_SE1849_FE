import React, { useState } from "react";

import { Button, Input, Upload, Typography, Space } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function CompanyInfoPage() {
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  return (
    <div style={{ maxWidth: 800 }}>
      <Title level={4}>Logo & Banner Image</Title>
      <Space size="large" align="start">
        <Upload listType="picture-card" maxCount={1} onChange={(info) => setLogo(info.file)}>
          {logo ? "Replace Logo" : <UploadOutlined />}
        </Upload>

        <Upload listType="picture-card" maxCount={1} onChange={(info) => setBanner(info.file)}>
          {banner ? "Replace Banner" : <UploadOutlined />}
        </Upload>
      </Space>

      <div style={{ marginTop: 24 }}>
        <label>Company Name</label>
        <Input placeholder="Enter company name" style={{ width: "60%" }} />
      </div>

      <div style={{ marginTop: 24 }}>
        <label>About Us</label>
        <div style={{ border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            <Space>
              <Button icon={<BoldOutlined />} />
              <Button icon={<ItalicOutlined />} />
              <Button icon={<UnderlineOutlined />} />
              <Button icon={<EditOutlined />} />
            </Space>
          </div>
          <textarea
            style={{
              width: "100%",
              minHeight: 150,
              padding: 8,
              border: "none",
              outline: "none",
            }}
          />
        </div>
      </div>

      <Button type="primary" style={{ marginTop: 24 }}>
        Save Change
      </Button>
    </div>
  );
}
