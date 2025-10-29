import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Button, Dropdown, Menu } from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { JobService } from "../../../../services/JobService";
import { useSearchParams } from "react-router-dom";

const { Content } = Layout;

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [numberOfApplications, setNumberOfApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  // Fetch number of applications from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await JobService.getNumberOfApplicationsByJobId(jobId);
        setNumberOfApplications(response.data.count);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  // Fetch applications when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await JobService.getApplicationsByJobId(jobId);
        setApplications(response.data);
        console.log("Fetched applications:", response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const sortMenu = (
    <Menu
      items={[
        { key: "newest", label: "Newest" },
        { key: "oldest", label: "Oldest" },
      ]}
    />
  );

  const columnMenu = (
    <Menu
      items={[
        { key: "edit", label: "Edit Column" },
        { key: "delete", label: "Delete" },
      ]}
    />
  );

  const ApplicationCard = ({ candidateName, role, experience, education, appliedDate, avatar }) => (
    <Card
      className="mb-6 rounded-2xl shadow-md transition-shadow duration-200 hover:shadow-lg"
      bodyStyle={{ padding: "16px 20px" }}
    >
      <div className="mb-3 flex items-center">
        <img
          src={avatar}
          alt={candidateName}
          className="mr-4 h-12 w-12 rounded-full border border-gray-200 object-cover"
        />
        <div>
          <h4 className="text-base font-semibold">{candidateName}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>

      <ul className="mb-2 space-y-1 text-sm text-gray-600">
        <li>• {experience} Years Experience</li>
        <li>• Education: {education}</li>
        <li>• Applied: {appliedDate}</li>
      </ul>

      <Button type="link" className="mt-2 p-0 text-blue-600 hover:text-blue-800">
        Download Cv
      </Button>
    </Card>
  );

  return (
    <Layout className="rounded-xl bg-white p-8 shadow-lg">
      <Content>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
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
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold">All Application ({numberOfApplications})</h3>
              <Dropdown overlay={columnMenu} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </div>

            <div className="min-h-[500px] rounded-xl bg-gray-50 p-6 shadow-inner">
              {loading ? (
                <p>Loading applications...</p>
              ) : (
                applications.map((app) => (
                  <ApplicationCard
                    key={app._id}
                    candidateName={app.candidateName}
                    role={app.role}
                    experience={app.experience}
                    education={app.education}
                    appliedDate={app.appliedDate}
                    avatar={app.avatar}
                  />
                ))
              )}
            </div>
          </Col>

          {/* Shortlisted */}
          {/* <Col span={12}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Shortlisted ({numberOfApplications})</h3>
              <Dropdown overlay={columnMenu} placement="bottomRight">
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </div>

            <div className="min-h-[500px] rounded-xl bg-gray-50 p-6 shadow-inner">
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
                className="mt-6 rounded-xl border-gray-300 py-2 transition-colors hover:border-blue-500 hover:text-blue-600"
              >
                Create New Column
              </Button>
            </div>
          </Col> */}
        </Row>
      </Content>
    </Layout>
  );
};

export default Applications;
