import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JobService } from "../../../services/JobService";
import {
  Bookmark,
  DollarSign,
  MapPin,
  Gift,
  Calendar,
  Clock,
  Layers,
  Users,
  BookOpen,
  Share2,
  Link as LinkIcon,
  Linkedin,
  Facebook as FacebookIcon,
  Twitter,
  Mail,
  Tag as TagIcon,
  User,
} from "lucide-react";

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

// Apply Modal Component
function ApplyModal({ open, onClose, jobTitle }) {
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor">
            <path d="M6 6l10 10M6 16L16 6" strokeWidth="2" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold mb-4">Apply Job: {jobTitle}</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Choose Resume
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="resume1.pdf">Resume 1 (resume1.pdf)</option>
            <option value="resume2.pdf">Resume 2 (resume2.pdf)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Cover Letter</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-[100px]"
            placeholder="Write down your biography here. Let the employers know who you are..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="flex gap-2 mt-2 text-gray-400">
            <button type="button" className="hover:text-blue-500">
              <b>B</b>
            </button>
            <button type="button" className="hover:text-blue-500">
              <i>I</i>
            </button>
            <button type="button" className="hover:text-blue-500">
              U
            </button>
            <button type="button" className="hover:text-blue-500">
              🔗
            </button>
            <button type="button" className="hover:text-blue-500">
              •
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            type="button"
            onClick={() => {
              alert("Applied!");
              onClose();
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Job Details Page
export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showApply, setShowApply] = useState(false);

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
      <ApplyModal
        open={showApply}
        onClose={() => setShowApply(false)}
        jobTitle={job.title}
      />
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
            <Bookmark className="text-blue-500" size={22} />
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowApply(true)}
          >
            Apply Now <span className="ml-1">→</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left: Job Description (6 columns) */}
        <div className="col-span-1 lg:col-span-6 max-w-full">
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
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
                <h2 className="font-semibold text-lg mt-6 mb-2 flex items-center gap-2">
                  <Gift size={18} className="text-green-600" /> Benefits
                </h2>
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
          {/* Salary & Location */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm flex-1 flex flex-col gap-2">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <DollarSign size={16} className="text-green-600" />
                Salary (USD)
              </div>
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
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin size={16} className="text-blue-600" />
                Job Location
              </div>
              <div className="flex items-center gap-1 text-gray-700 font-medium">
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
          {/* Job Benefits */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Gift size={16} className="text-green-600" /> Job Benefits
            </div>
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
          {/* Job Overview */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Layers size={16} className="text-blue-600" /> Job Overview
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <Calendar size={14} className="text-blue-600" />
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
                  <Clock size={14} className="text-blue-600" />
                  JOB EXPIRE IN:
                </div>
                <div>
                  {job.expiration
                    ? new Date(job.expiration).toLocaleDateString()
                    : "--"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <User size={14} className="text-blue-600" />
                  JOB LEVEL:
                </div>
                <div>{job.jobLevel || "--"}</div>
              </div>
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <Users size={14} className="text-blue-600" />
                  EXPERIENCE:
                </div>
                <div>{job.experience || "--"}</div>
              </div>
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <BookOpen size={14} className="text-blue-600" />
                  EDUCATION:
                </div>
                <div>{job.education || "--"}</div>
              </div>
              <div>
                <div className="text-gray-400 flex items-center gap-1">
                  <Users size={14} className="text-blue-600" />
                  VACANCIES:
                </div>
                <div>{job.vacancies || "--"}</div>
              </div>
            </div>
          </div>
          {/* Share & Tags */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Share2 size={16} className="text-blue-600" /> Share this job:
            </div>
            <div className="flex gap-2 mb-2">
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded p-2"
                title="Copy Link"
              >
                <LinkIcon size={16} />
              </button>
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded p-2"
                title="LinkedIn"
              >
                <Linkedin size={16} className="text-blue-700" />
              </button>
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded p-2"
                title="Facebook"
              >
                <FacebookIcon size={16} className="text-blue-600" />
              </button>
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded p-2"
                title="Twitter"
              >
                <Twitter size={16} className="text-blue-400" />
              </button>
              <button
                className="bg-gray-100 hover:bg-gray-200 rounded p-2"
                title="Email"
              >
                <Mail size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <TagIcon size={14} /> Job tags:
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.tags) && job.tags.length > 0
                ? job.tags.map((tag, i) => (
                    <Tag key={tag._id || i}>{tag.name}</Tag>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
