import React from "react";
import { Link } from "react-router-dom";

// Job Card Component
const JobCard = ({ job, typeColor }) => {
  const color = typeColor[job.jobType?.toUpperCase()] || {
    bg: "var(--color-neutral-100)",
    color: "var(--color-neutral-900)",
  };
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block"
      style={{ textDecoration: "none" }}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-none hover:shadow transition relative cursor-pointer"
        style={{
          background: "linear-gradient(90deg, #fff 80%, #fffbe9 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: color.bg, color: color.color }}
          >
            {job.jobType}
          </span>
          <span className="text-gray-400 text-md ml-2">
            Salary:{" "}
            {job.minSalary && job.maxSalary
              ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
              : "Negotiable"}
          </span>
        </div>
        <h3 className="font-semibold text-base mb-2">{job.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={
              job.company?.logo ||
              "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
            }
            alt="logo"
            className="w-8 h-8 rounded"
          />
          <div>
            <div className="font-medium text-sm">
              {job.company?.name || "Company"}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                className="inline-block mr-1 text-gray-400"
              >
                <path
                  d="M7 12s5-3.33 5-7A5 5 0 1 0 2 5c0 3.67 5 7 5 7z"
                  strokeWidth="1.2"
                />
              </svg>
              {/* Sửa location: ưu tiên city, country, remote */}
              {job.city && job.country
                ? `${job.city}, ${job.country}`
                : job.city || job.country || (job.remote ? "Remote" : "N/A")}
              {job.remote && (
                <span className="ml-2 text-green-600 font-semibold">(Remote)</span>
              )}
            </div>
          </div>
        </div>
        <button
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
          type="button"
          tabIndex={-1}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
          >
            <path
              d="M5 8.5C5 6.01472 7.01472 4 9.5 4C11.9853 4 14 6.01472 14 8.5C14 12.5 9.5 16 9.5 16C9.5 16 5 12.5 5 8.5Z"
              strokeWidth="1.3"
            />
          </svg>
        </button>
      </div>
    </Link>
  );
};

export default JobCard;