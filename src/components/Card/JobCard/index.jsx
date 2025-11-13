import { Avatar, Card, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import JobToggleFavorite from "../../Toggle/JobToggleFavorite";

const JobCard = ({
  user = null,
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
      className="flex h-full flex-col justify-between rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
      bodyStyle={{ padding: "16px", height: "100%" }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">{title}</h3>
            {user && <JobToggleFavorite jobId={jobId} initialIsFavorited={isFavorite} />}
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

        <Link to={`/jobs/${jobId}`} className="mt-4 block">
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={`${company} logo`}
                className="h-10 w-10 flex-shrink-0 rounded object-cover"
              />
            ) : (
              <Avatar shape="square" size={50} className="flex-shrink-0 bg-gray-200 text-gray-600">
                {company.charAt(0)}
              </Avatar>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-800">{company}</p>
              <p className="flex items-center gap-1 truncate text-sm text-gray-500">
                <EnvironmentOutlined /> {location}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
