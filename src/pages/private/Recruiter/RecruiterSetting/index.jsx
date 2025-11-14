import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import {
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
    <div style={{ padding: '24px 24px 24px 0', minHeight: '100vh' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Settings</span>
          </div>
        }
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: 0 }}
        headStyle={{ padding: '12px 16px' }}
      >
        <Tabs
          items={tabItems}
          size="large"
          tabBarStyle={{ marginBottom: '16px' }}
        />
      </Card>
    </div>
  );
};

export default RecruiterSettings;