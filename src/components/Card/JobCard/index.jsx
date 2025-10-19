import { Card, Tag, Tooltip } from "antd";
import { EnvironmentOutlined, BookOutlined } from "@ant-design/icons";

const JobCard = ({
  title = "Technical Support Specialist",
  type = "PART-TIME",
  salary = "$20,000 - $25,000",
  company = "Google Inc.",
  location = "Dhaka, Bangladesh",
  logo = "https://www.google.com/favicon.ico",
}) => {
  return (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
      bodyStyle={{ padding: "16px" }}
    >
      {/* Job title + salary */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 font-semibold text-lg">{title}</h3>
          <Tooltip title="Save job">
            <BookOutlined className="text-gray-400 hover:text-blue-600 text-lg cursor-pointer" />
          </Tooltip>
        </div>

        <div className="flex items-center gap-3 text-sm mt-1">
          <Tag color="green" className="m-0 px-2 py-0.5 text-xs font-medium rounded">
            {type}
          </Tag>
          <span className="text-gray-500">
            <span className="font-medium text-gray-700">Salary:</span> {salary}
          </span>
        </div>
      </div>

      {/* Company + location */}
      <div className="flex items-center gap-3 mt-4">
        <img src={logo} alt={company} className="w-10 h-10 object-contain rounded" />
        <div>
          <p className="font-medium text-gray-800">{company}</p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <EnvironmentOutlined /> {location}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
