import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import {
  SettingOutlined,
  BankOutlined,
  ShareAltOutlined,
  UserOutlined,
  PictureOutlined
} from '@ant-design/icons';

import AccountSetting from './AccountSetting';
import AvatarSetting from './AvatarSetting';

const { Title } = Typography;

const RecruiterSettings = () => {
  // const [activeTab, setActiveTab] = useState('company');

  const tabItems = [
    // {
    //   key: 'company',
    //   label: (
    //     <span>
    //       <BankOutlined />
    //       Company Info
    //     </span>
    //   ),
    //   children: <CompanyInfo />,
    // },
    // {
    //   key: 'social',
    //   label: (
    //     <span>
    //       <ShareAltOutlined />
    //       Social Media Profile
    //     </span>
    //   ),
    //   children: <SocialMediaProfile />,
    // },
    {
      key: 'account',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          <span>Account Setting</span>
        </div>
      ),
      children: <AccountSetting />,
    },
    {
      key: 'avatar',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PictureOutlined />
          <span>Avatar</span>
        </div>
      ),
      children: <AvatarSetting />,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingOutlined />
            <span>Settings</span>
          </div>
        }
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <Tabs
          // activeKey={activeTab}
          // onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabBarStyle={{ marginBottom: '24px' }}
        />
      </Card>
    </div>
  );
};

export default RecruiterSettings;