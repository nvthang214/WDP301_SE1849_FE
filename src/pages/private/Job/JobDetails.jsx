import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JobService } from "../../../services/JobService";

const typeColor = {
  "FULL-TIME": { bg: "#22c55e", color: "#fff" },
  "PART-TIME": { bg: "#f59e42", color: "#fff" },
  INTERNSHIP: { bg: "#38bdf8", color: "#fff" },
  TEMPORARY: { bg: "#a78bfa", color: "#fff" },
  "CONTRACT BASE": { bg: "#f472b6", color: "#fff" },
};

function Tag({ children }) {
  return (
    <span className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-1 text-xs mr-2 mb-2">
      {children}
    </span>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await JobService.getJobById(id);
        setJob(res.data);
      } catch {
        setJob(null);
      }
    }
    fetchJob();
  }, [id]);

  if (!job) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  const color = typeColor[job.jobType?.toUpperCase()] || {
    bg: "var(--color-neutral-100)",
    color: "var(--color-neutral-900)",
  };

  return (
    <div className="bg-gray-50 min-h-screen px-0 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white rounded-xl px-8 py-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={
              job.company?.logo ||
              "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
            }
            alt="logo"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              {job.jobType && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: color.bg, color: color.color }}
                >
                  {job.jobType}
                </span>
              )}
              <span className="ml-1 text-xs bg-red-100 text-red-500 px-2 py-1 rounded font-semibold">
                Featured
              </span>
            </div>
            <div className="text-gray-500">
              at{" "}
              <span className="font-semibold">
                {job.company?.name || "Company"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
          <button className="p-2 rounded hover:bg-blue-50 border border-blue-100">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              className="text-blue-500"
            >
              <path
                d="M5 8.5C5 6.01472 7.01472 4 11 4C14.9853 4 17 6.01472 17 8.5C17 12.5 11 18 11 18C11 18 5 12.5 5 8.5Z"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
            Apply Now <span className="ml-1">→</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left: Job Description (6 columns) */}
        <div className="col-span-1 lg:col-span-6 max-w-full">
          {/* ...Job Description content... */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            {/* ...description, requirements, desirable, benefits... */}
            <h2 className="font-semibold text-lg mb-2">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
            {job.requirements && (
              <>
                <h2 className="font-semibold text-lg mt-6 mb-2">
                  Requirements
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.requirements.split("\n").map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </>
            )}
            {job.desirable && (
              <>
                <h2 className="font-semibold text-lg mt-6 mb-2">Desirable</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {job.desirable.split("\n").map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </>
            )}
            {job.benefits && job.benefits.length > 0 && (
              <>
                <h2 className="font-semibold text-lg mt-6 mb-2">Benefits</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {Array.isArray(job.benefits)
                    ? job.benefits.map((b, idx) => <li key={idx}>{b}</li>)
                    : job.benefits
                        .split("\n")
                        .map((line, idx) => <li key={idx}>{line}</li>)}
                </ul>
              </>
            )}
          </div>
        </div>
        {/* Right: Sidebar (4 columns) */}
        <div className="col-span-1 lg:col-span-4 flex-shrink-0 flex flex-col gap-6">
          {/* ...Sidebar content (salary, location, benefits, overview, share, tags)... */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* ...salary & location... */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex-1 flex flex-col gap-2">
              <div className="text-xs text-gray-400">Salary (USD)</div>
              <div className="text-green-600 font-bold text-xl">
                {job.minSalary && job.maxSalary
                  ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                  : "Negotiable"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {job.salaryType ? job.salaryType + " salary" : ""}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm flex-1 flex flex-col gap-2">
              <div className="text-xs text-gray-400">Job Location</div>
              <div className="flex items-center gap-1 text-gray-700 font-medium">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  className="inline-block text-blue-600"
                >
                  <path
                    d="M8 14s5-3.33 5-7A5 5 0 1 0 3 7c0 3.67 5 7 5 7z"
                    strokeWidth="1.5"
                  />
                </svg>
                {job.city && job.country
                  ? `${job.city}, ${job.country}`
                  : job.city || job.country || "N/A"}
                {job.remote && (
                  <span className="ml-2 text-xs text-green-600 font-semibold">
                    (Remote)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-2">Job Benefits</div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.benefits)
                ? job.benefits.map((b, i) => (
                    <span
                      key={i}
                      className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {b}
                    </span>
                  ))
                : null}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-2">Job Overview</div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              {/* ...overview fields... */}
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block text-blue-600"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="12"
                      height="12"
                      rx="3"
                      strokeWidth="1.5"
                    />
                  </svg>
                  JOB POSTED:
                </div>
                <div>
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "--"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block text-blue-600"
                  >
                    <path
                      d="M8 2v2M8 12v2M2 8h2m8 0h2M4.93 4.93l1.41 1.41M12.66 12.66l1.41 1.41M4.93 11.07l1.41-1.41M12.66 3.34l1.41-1.41"
                      strokeWidth="1.5"
                    />
                  </svg>
                  JOB EXPIRE IN:
                </div>
                <div>
                  {job.expiration
                    ? new Date(job.expiration).toLocaleDateString()
                    : "--"}
                </div>
              </div>
              <div>
                <div className="text-gray-400">JOB LEVEL:</div>
                <div>{job.jobLevel || "--"}</div>
              </div>
              <div>
                <div className="text-gray-400">EXPERIENCE:</div>
                <div>{job.experience || "--"}</div>
              </div>
              <div>
                <div className="text-gray-400">EDUCATION:</div>
                <div>{job.education || "--"}</div>
              </div>
              <div>
                <div className="text-gray-400">VACANCIES:</div>
                <div>{job.vacancies || "--"}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-2">Share this job:</div>
            <div className="flex gap-2 mb-2">{/* ...share buttons... */}</div>
            <div className="text-xs text-gray-400 mb-1">Job tags:</div>
            <div className="flex flex-wrap gap-2">
              {job.tags
                ? job.tags
                    .split(",")
                    .map((tag, i) => <Tag key={i}>{tag.trim()}</Tag>)
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
