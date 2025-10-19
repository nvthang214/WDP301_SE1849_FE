import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Clock, MoreVertical } from "lucide-react";

import { JobService } from "../../../../../services/JobService";
import { Link } from "react-router-dom";

const statusOptions = [
  { label: "All Jobs", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
];

const formatJobType = (job) => job?.jobType?.replace("-", " ") || "N/A";

const getApplicationsCount = (job) =>
  job?.applicationsCount ?? job?.applications?.length ?? job?.statistics?.applications ?? 0;

const getStatusLabel = (job) => (job?.isActive ? "Active" : "Expired");

const getStatusClass = (isActive) =>
  isActive
    ? "bg-[var(--color-success-100)] text-[var(--color-success-700)] border border-[var(--color-success-200)]"
    : "bg-[var(--color-danger-100)] text-[var(--color-danger-600)] border border-[var(--color-danger-200)]";

const getRemainingDays = (expiration) => {
  if (!expiration) return "No expiry";
  const diff =
    (new Date(expiration).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
    (1000 * 60 * 60 * 24);
  if (Number.isNaN(diff)) return "No expiry";
  if (diff > 0) return `${Math.ceil(diff)} days remaining`;
  if (diff === 0) return "Expires today";
  return `Expired ${Math.abs(Math.ceil(diff))} days ago`;
};

export default function MyJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const recruiterId = JSON.parse(localStorage.getItem("recruiterInfo") || "{}")?._id;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = recruiterId
          ? await JobService.getJobsByRecruiterId(recruiterId)
          : await JobService.getJobs({ limit: 100 });
        const list = res?.data?.jobs || res?.data || [];
        setJobs(list);
      } catch (error) {
        console.error("Failed to load recruiter jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (statusFilter === "active") return job?.isActive;
      if (statusFilter === "expired") return !job?.isActive;
      return true;
    });
  }, [jobs, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setStatusDropdownOpen(false);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)] md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
            My Jobs{" "}
            <span className="text-sm font-medium text-[var(--color-neutral-500)]">
              ({jobs.length})
            </span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
            Monitor all openings, application counts, and status in one place.
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] shadow-sm transition hover:border-[var(--color-primary-300)]"
            onClick={() => setStatusDropdownOpen((prev) => !prev)}
          >
            Job status
            <span className="rounded-lg bg-[var(--color-primary-50)] px-2 py-1 text-xs font-semibold text-[var(--color-primary-600)]">
              {statusOptions.find((option) => option.value === statusFilter)?.label}
            </span>
            <ChevronDown size={16} strokeWidth={1.6} />
          </button>
          {statusDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-lg)]">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                    statusFilter === option.value
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
                      : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]"
                  }`}
                >
                  {option.label}
                  {statusFilter === option.value && (
                    <span className="text-xs font-semibold text-[var(--color-primary-500)]">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)]">
        <div className="grid grid-cols-[1.6fr_0.5fr_0.5fr_auto] items-center gap-4 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-neutral-500)]">
          <span>Jobs</span>
          <span>Status</span>
          <span>Applications</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-[var(--color-neutral-500)]">
            Loading jobs...
          </div>
        ) : paginatedJobs.length === 0 ? (
          <div className="px-6 py-16 text-center text-[var(--color-neutral-500)]">
            No job found for current filter.
          </div>
        ) : (
          paginatedJobs.map((job) => {
            const statusLabel = getStatusLabel(job);
            const applications = getApplicationsCount(job);
            const remaining = getRemainingDays(job?.expiration);
            return (
              <div
                key={job?._id}
                className="group grid grid-cols-[1.6fr_0.5fr_0.5fr_auto] items-center gap-4 border-b border-[var(--color-neutral-100)] px-6 py-5 last:border-none hover:bg-[var(--color-primary-50)]/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-neutral-900)]">
                        {job?.title || "Untitled Position"}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--color-neutral-500)]">
                        <span className="rounded-full bg-[var(--color-primary-50)] px-2 py-0.5 text-xs font-semibold text-[var(--color-primary-600)]">
                          {formatJobType(job)}
                        </span>
                        {job?.jobLevel && (
                          <span className="text-[var(--color-neutral-500)]">• {job.jobLevel}</span>
                        )}
                        {job?.location && (
                          <span className="text-[var(--color-neutral-500)]">• {job.location}</span>
                        )}
                      </div>
                    </div>
                    <div className="hidden text-sm font-medium text-[var(--color-neutral-500)] md:flex">
                      <Clock className="mr-1 h-4 w-4 text-[var(--color-primary-400)]" />
                      {remaining}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      job?.isActive
                    )}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {statusLabel}
                  </span>
                </div>

                <div className="text-sm font-semibold text-[var(--color-neutral-700)]">
                  {applications} Applications
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button className="rounded-full border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-600)] transition hover:bg-[var(--color-primary-500)] hover:text-white">
                    View Applications
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)]"
                      onClick={() =>
                        setActiveMenuId((prev) => (prev === job?._id ? null : job?._id))
                      }
                    >
                      <MoreVertical size={18} strokeWidth={1.6} />
                    </button>
                    {activeMenuId === job?._id && (
                      <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[var(--color-neutral-200)] bg-white py-1 text-sm shadow-[var(--shadow-lg)]">
                        {["Promote Job", job?.isActive ? "Make it Expire" : "Activate Job"].map(
                          (action) => (
                            <button
                              key={action}
                              type="button"
                              className="flex w-full items-center justify-between px-4 py-2 text-[var(--color-neutral-600)] transition hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
                            >
                              <Link to={`/${action.replace(" ", "-").toLowerCase()}`}>
                                {action}
                              </Link>
                              <span className="text-xs text-[var(--color-neutral-300)]">→</span>
                            </button>
                          )
                        )}
                        <button
                          type="button"
                          className="flex w-full items-center justify-between px-4 py-2 text-[var(--color-neutral-600)] transition hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-600)]"
                        >
                          <Link to={`/recruiter/jobs/edit/${job?._id}`}>View Details</Link>
                          <span className="text-xs text-[var(--color-neutral-300)]">→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)] disabled:opacity-40"
          >
            <ArrowLeft size={18} strokeWidth={1.6} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                page === number
                  ? "bg-[var(--color-primary-500)] text-white shadow-[var(--shadow-md)]"
                  : "border border-transparent bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)]"
              }`}
            >
              {number.toString().padStart(2, "0")}
            </button>
          ))}
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)] disabled:opacity-40"
          >
            <ArrowRight size={18} strokeWidth={1.6} />
          </button>
        </div>
      )}
    </div>
  );
}
