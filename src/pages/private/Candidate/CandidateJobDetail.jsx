import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { JobService } from "../../../services/JobService";
import { CandidateService } from "../../../services/CandidateService";
import { Tag } from "antd";
import DOMPurify from "dompurify";
import useAuthStore from "../../../store/useAuthStore";
import { notifySuccess, notifyWarning } from "../../../components/Notification";
import {
  DollarSign,
  MapPin,
  Gift,
  ListChevronsUpDown,
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
  HandCoins,
  Hourglass,
} from "lucide-react";
import JobToggleFavorite from "../../../components/Toggle/JobToggleFavorite";

const typeColor = {
  "FULL-TIME": { bg: "#22c55e", color: "#fff" },
  "PART-TIME": { bg: "#f59e42", color: "#fff" },
  INTERNSHIP: { bg: "#38bdf8", color: "#fff" },
  TEMPORARY: { bg: "#a78bfa", color: "#fff" },
  "CONTRACT BASE": { bg: "#f472b6", color: "#fff" },
};

const presetTagColors = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

// Apply Modal Component
function ApplyModal({ open, onClose, jobTitle, onSubmit, submitting }) {
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (!open) {
      setResume("");
      setCoverLetter("");
    }
  }, [open]);

  if (!open) return null;

  const handleApply = async () => {
    try {
      await onSubmit({ resume, coverLetter });
    } catch (err) {
      /* handled upstream */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor">
            <path d="M6 6l10 10M6 16L16 6" strokeWidth="2" />
          </svg>
        </button>
        <div className="mb-4 text-lg font-semibold">Apply Job: {jobTitle}</div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Cover Letter</label>
          <textarea
            className="min-h-[100px] w-full rounded border px-3 py-2"
            placeholder="Write down your biography here. Let the employers know who you are..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="mt-2 flex gap-2 text-gray-400">
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
        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded border border-gray-300 bg-gray-50 px-4 py-2 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] px-6 py-2 font-semibold !text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--color-primary-600)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] focus-visible:outline-none"
            type="button"
            onClick={handleApply}
            disabled={submitting}
          >
            {submitting ? "Applying..." : "Apply Now"}
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
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function fetchJob() {
      try {
        let flag = "";
        try {
          const { fetchMe } = useAuthStore.getState();
          flag = fetchMe == null ? "isFavorite" : "";
        } catch (error) {
          // Do nothing
          console.error("Error fetching user:", error);
        }

        const res = await CandidateService.getJobById(id);
        setJob(res.data);
      } catch {
        setJob(null);
      }
    }
    fetchJob();
  }, [id]);

  if (!job) {
    return <div className="py-10 text-center text-gray-400">Loading...</div>;
  }

  const color = typeColor[job.jobType?.toUpperCase()] || {
    bg: "var(--color-neutral-100)",
    color: "var(--color-neutral-900)",
  };

  const handleSubmitApplication = async ({ resume, coverLetter }) => {
    const candidateId = user?._id || user?.id;
    if (!candidateId) {
      notifyWarning("Vui lòng đăng nhập để ứng tuyển.");
      setShowApply(false);
      return;
    }

    setSubmitting(true);
    try {
      const response = await CandidateService.applyJob(candidateId, {
        jobId: id,
        resume,
        coverLetter,
      });

      notifySuccess(response?.msg || "Ứng tuyển thành công");
      setShowApply(false);
    } catch (error) {
      /* errors are notified via interceptor */
      console.error("Error applying for job:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-0 py-4 md:px-8">
      <ApplyModal
        open={showApply}
        onClose={() => setShowApply(false)}
        jobTitle={job.title}
        onSubmit={handleSubmitApplication}
        submitting={submitting}
      />

      {/* Main content */}
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Job Description (6 columns) */}
        <div className="col-span-1 max-w-full lg:col-span-8">
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="m-0 text-2xl font-bold">{job.title}</div>
                {job.jobType && (
                  <span
                    className="rounded px-2 py-1 text-xs font-semibold"
                    style={{ backgroundColor: color.bg, color: color.color }}
                  >
                    {job.jobType}
                  </span>
                )}
              </div>
              <JobToggleFavorite jobId={job._id} isFavorite={job.isFavorite} />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
                  <DollarSign size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Salary</p>
                  <p className="text-base font-semibold text-gray-900">
                    {job.minSalary && job.maxSalary
                      ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                      : job.salaryType || "Negotiable"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
                  <MapPin size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Location</p>
                  <p className="text-base font-semibold text-gray-900">
                    {job.location || job.city || job.country || "Not updated"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
                  <Hourglass size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Experience</p>
                  <p className="text-base font-semibold text-gray-900">
                    {job.experience || "Not required"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                <Clock size={16} className="text-gray-500" />
                <span>
                  Application deadline:{" "}
                  {job.expiration ? new Date(job.expiration).toLocaleDateString() : "Not specified"}
                </span>
              </div>
              <div className="flex flex-col gap-3 md:flex-row">
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-white p-8 shadow-md">
            {job.description && (
              <>
                <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                  <ListChevronsUpDown size={20} className="text-[var(--color-primary-600)]" />
                  Job Description
                </h2>
                <div
                  className="prose prose-sm max-w-none break-words text-gray-700 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.description),
                  }}
                />
              </>
            )}
            {job.requirements && (
              <>
                <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                  <ListChevronsUpDown size={20} className="text-[var(--color-primary-600)]" />
                  Job Requirements
                </h2>
                <div
                  className="prose prose-sm max-w-none break-words text-gray-700 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.requirements),
                  }}
                />
              </>
            )}
            {job.desirable && (
              <>
                <h2 className="mt-6 mb-2 flex items-center gap-2 text-lg font-semibold">
                  <HandCoins size={20} className="text-[var(--color-primary-600)]" />
                  Desirable
                </h2>
                <div
                  className="prose prose-sm max-w-none break-words text-gray-700 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.desirable),
                  }}
                />
              </>
            )}
            {job.benefits && (
              <>
                <h2 className="mt-6 mb-2 flex items-center gap-2 text-lg font-semibold">
                  <Gift size={20} className="text-[var(--color-primary-600)]" /> Benefits
                </h2>
                <div
                  className="prose prose-sm max-w-none break-words text-gray-700 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.benefits),
                  }}
                />
              </>
            )}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin size={16} className="text-blue-600" />
                Job Location
              </div>
              <div className="flex items-center gap-1 font-medium text-gray-700">
                {job.city && job.country
                  ? `${job.location}, ${job.city}, ${job.country}`
                  : job.city || job.country || "N/A"}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Sidebar (4 columns) */}
        <div className="col-span-1 flex flex-shrink-0 flex-col gap-6 lg:col-span-4">
          {/* Job Overview */}
          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Layers size={16} className="text-[var(--color-primary-600)]" /> Job Overview
              {job.remote && (
                <span className="ml-2 text-xs font-semibold text-[var(--color-primary-600)]">
                  (Remote)
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar size={14} className="text-blue-600" />
                  JOB POSTED:
                </div>
                <div>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "--"}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock size={14} className="text-blue-600" />
                  JOB EXPIRE IN:
                </div>
                <div>{job.expiration ? new Date(job.expiration).toLocaleDateString() : "--"}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <User size={14} className="text-blue-600" />
                  JOB LEVEL:
                </div>
                <div>{job.jobLevel || "--"}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Users size={14} className="text-blue-600" />
                  EXPERIENCE:
                </div>
                <div>{job.experience || "--"}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <BookOpen size={14} className="text-blue-600" />
                  EDUCATION:
                </div>
                <div>{job.education || "--"}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Users size={14} className="text-blue-600" />
                  VACANCIES:
                </div>
                <div>{job.vacancies || "--"}</div>
              </div>
            </div>
          </div>
          {/* Share & Tags */}
          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Share2 size={16} className="text-blue-600" /> Share this job:
            </div>
            <div className="mb-2 flex gap-2">
              <button className="rounded bg-gray-100 p-2 hover:bg-gray-200" title="Copy Link">
                <LinkIcon size={16} />
              </button>
              <button className="rounded bg-gray-100 p-2 hover:bg-gray-200" title="LinkedIn">
                <Linkedin size={16} className="text-blue-700" />
              </button>
              <button className="rounded bg-gray-100 p-2 hover:bg-gray-200" title="Facebook">
                <FacebookIcon size={16} className="text-blue-600" />
              </button>
              <button className="rounded bg-gray-100 p-2 hover:bg-gray-200" title="Twitter">
                <Twitter size={16} className="text-blue-400" />
              </button>
              <button className="rounded bg-gray-100 p-2 hover:bg-gray-200" title="Email">
                <Mail size={16} />
              </button>
            </div>
            <div className="mb-1 flex items-center gap-1 text-xs text-gray-400">
              <TagIcon size={14} /> Job tags:
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.tags) && job.tags.length > 0
                ? job.tags.map((tag, i) => (
                    <Link key={i} to={`/jobs?search=${encodeURIComponent(tag.name.toLowerCase())}`}>
                      <Tag
                        color={presetTagColors[i % presetTagColors.length]}
                        className="px-3 py-1 font-semibold text-[var(--color-neutral-900)] capitalize"
                      >
                        {tag.name}
                      </Tag>
                    </Link>
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
