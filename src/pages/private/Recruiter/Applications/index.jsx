import React from 'react';
import { Layout, Row, Col, Card, Button, Dropdown, Menu } from 'antd';
import {
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  MoreOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

const Applications = () => {
  const sortMenu = (
    <Menu
      items={[
        { key: 'newest', label: 'Newest' },
        { key: 'oldest', label: 'Oldest' },
      ]}
    />
  );

  const columnMenu = (
    <Menu
      items={[
        { key: 'edit', label: 'Edit Column' },
        { key: 'delete', label: 'Delete' },
      ]}
    />
  );

  const ApplicationCard = ({ candidateName, role, experience, education, appliedDate, avatar }) => (
    <Card
      className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl mb-6"
      bodyStyle={{ padding: '16px 20px' }}
    >
      <div className="flex items-center mb-3">
        <img
          src={avatar}
          alt={candidateName}
          className="w-12 h-12 rounded-full mr-4 border border-gray-200 object-cover"
        />
        <div>
          <h4 className="font-semibold text-base">{candidateName}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>

      <ul className="text-gray-600 text-sm space-y-1 mb-2">
        <li>• {experience} Years Experience</li>
        <li>• Education: {education}</li>
        <li>• Applied: {appliedDate}</li>
      </ul>

      <Button type="link" className="p-0 mt-2 text-blue-600 hover:text-blue-800">
        Download Cv
      </Button>
    </Card>
  );

  return (
    <Layout className="p-8 bg-white rounded-xl shadow-lg">
      <Content>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          <div className="flex space-x-3">
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Dropdown overlay={sortMenu} placement="bottomRight">
              <Button icon={<SortAscendingOutlined />}>Sort</Button>
            </Dropdown>
          </div>
        </div>

        {/* Columns */}
        <Row gutter={24}>
          {/* All Applications */}
          <Col span={12}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold">All Application (213)</h3>
              <Dropdown overlay={columnMenu} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl min-h-[500px] shadow-inner">
              <ApplicationCard
                candidateName="Ronald Richards"
                role="UI/UX Designer"
                experience="7"
                education="Master Degree"
                appliedDate="Jan 23, 2022"
                avatar="https://via.placeholder.com/150/FF0000/FFFFFF?text=RR"
              />
              <ApplicationCard
                candidateName="Theresa Webb"
                role="Product Designer"
                experience="7"
                education="High School Degree"
                appliedDate="Jan 23, 2022"
                avatar="https://via.placeholder.com/150/0000FF/FFFFFF?text=TW"
              />
              <ApplicationCard
                candidateName="Devon Lane"
                role="User Experience Designer"
                experience="7"
                education="Master Degree"
                appliedDate="Jan 23, 2022"
                avatar="https://via.placeholder.com/150/008000/FFFFFF?text=DL"
              />
              <ApplicationCard
                candidateName="Kathryn Murphy"
                role="UI/UX Designer"
                experience="7"
                education="Master Degree"
                appliedDate="Jan 23, 2022"
                avatar="https://via.placeholder.com/150/FFFF00/000000?text=KM"
              />
            </div>
          </Col>

          {/* Shortlisted */}
          <Col span={12}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold">Shortlisted (2)</h3>
              <Dropdown overlay={columnMenu} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl min-h-[500px] shadow-inner">
              <ApplicationCard
                candidateName="Darrell Steward"
                role="UI/UX"
                experience="7"
                education="Intermediate Degree"
                appliedDate="Jan 23, 2022"
                avatar="https://via.placeholder.com/150/FFA500/FFFFFF?text=DS"
              />
              <ApplicationCard
                candidateName="Jenny Wilson"
                role="UI Designer"
                experience="7"
                education="Bachelor Degree"
                appliedDate="Jan 23, 2022"
                avatar="https://via.placeholder.com/150/800080/FFFFFF?text=JW"
              />

              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                className="mt-6 py-2 rounded-xl border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                Create New Column
              </Button>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Applications;
