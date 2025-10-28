import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import {
  SettingOutlined,
  BankOutlined,
  ShareAltOutlined,
  UserOutlined
} from '@ant-design/icons';

import AccountSetting from './AccountSetting';

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
        <span>
          <UserOutlined />
          Account Setting
        </span>
      ),
      children: <AccountSetting />,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        title={
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Settings
          </h2>
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