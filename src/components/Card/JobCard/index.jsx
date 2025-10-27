import { Card, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import JobToggleFavorite from "../../Toggle/JobToggleFavorite";

const JobCard = ({
  jobId = null,
  title = "Technical Support Specialist",
  type = "PART-TIME",
  salary = "$20,000 - $25,000",
  company = "Google Inc.",
  location = "Dhaka, Bangladesh",
  logo = "https://www.google.com/favicon.ico",
  isFavorite = false,
}) => {
  return (
    <Card
      className="rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
      bodyStyle={{ padding: "16px" }}
    >
      {/* Job title + salary */}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <JobToggleFavorite isFavorite={isFavorite} jobId={jobId} />
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Tag color="green" className="m-0 rounded px-2 py-0.5 text-xs font-medium">
            {type}
          </Tag>
          <span className="text-gray-500">
            <span className="font-medium text-gray-700">Salary:</span> {salary}
          </span>
        </div>
      </div>

      {/* Company + location */}
      <Link to={`/jobs/${jobId}`} className="mt-2 flex items-center gap-3">
        <div className="flex items-center gap-3">
          <img src={logo} alt={company} className="h-15 w-15 rounded object-cover" />
          <div>
            <p className="font-medium text-gray-800">{company}</p>
            <p className="flex items-center gap-1 text-sm text-gray-500">
              <EnvironmentOutlined /> {location}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default JobCard;
