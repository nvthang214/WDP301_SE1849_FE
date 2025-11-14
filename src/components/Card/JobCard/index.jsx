import { Avatar, Card, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import JobToggleFavorite from "../../Toggle/JobToggleFavorite";

const JobCard = ({
  userRole = null,
  jobId = null,
  title = "Technical Support Specialist",
  type = "PART-TIME",
  salary = "$20,000 - $25,000",
  company = "Google Inc.",
  location = "Dhaka, Bangladesh",
  logo = "https://www.google.com/favicon.ico",
  isFavorite = false,
  tags = [], // ✅ Thêm tags prop
}) => {
  // Màu sắc cho tags
  const tagColors = ["blue", "purple", "cyan", "geekblue", "magenta", "volcano"];

  return (
    <Card
      className="flex h-full flex-col justify-between rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
      bodyStyle={{ padding: "16px", height: "100%" }}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Job title + salary */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {userRole === "candidate" && (
              <JobToggleFavorite jobId={jobId} isFavorite={isFavorite} />
            )}
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
          {/* ✅ Tags Section */}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, index) => (
                <Tag
                  key={tag._id || tag.name || index}
                  color={tagColors[index % tagColors.length]}
                  className="m-0 rounded-full px-2.5 py-0.5 text-xs"
                >
                  {tag.name}
                </Tag>
              ))}
              {tags.length > 3 && (
                <Tag className="m-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                  +{tags.length - 3} more
                </Tag>
              )}
            </div>
          )}
        </Link>
      </div>
    </Card>
  );
};

export default JobCard;
