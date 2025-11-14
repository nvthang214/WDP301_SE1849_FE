import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  MoreVertical,
  Plus,
  Search as SearchIcon,
  Filter,
  Edit,
  Eye,
  XCircle,
  CheckCircle,
  MapPin,
  Briefcase,
  ArrowUpDown,
  X,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { notifySuccess, notifyError } from "../../../../../components/Notification";
import { JobService } from "../../../../../services/JobService";
import { Link } from "react-router-dom";
import { Spin, Input, Select, Tooltip } from "antd";

const { Search } = Input;

const statusOptions = [
  { label: "All Jobs", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const jobTypeOptions = [
  { label: "All Types", value: "" },
  { label: "Full-time", value: "FULL-TIME" },
  { label: "Part-time", value: "PART-TIME" },
  { label: "Internship", value: "INTERNSHIP" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Contract", value: "CONTRACT BASE" },
];

const formatJobType = (job) => job?.jobType?.replace(/[_-]/g, " ") || "N/A";

const getStatusLabel = (job) => (job?.isActive ? "Active" : "Inactive");

const getStatusClass = (isActive) =>
  isActive
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-red-50 text-red-700 border border-red-200";

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
  const [applicationCounts, setApplicationCounts] = useState({});
  const [sorting, setSorting] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Search and filters state
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  // Fetch application counts
  useEffect(() => {
    if (!jobs.length) return;

    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        jobs.map(async (job) => {
          try {
            const res = await JobService.getNumberOfApplicationsByJobId(job._id);
            return [job._id, res?.data?.count ?? 0];
          } catch {
            return [job._id, 0];
          }
        })
      );

      if (!cancelled) {
        setApplicationCounts(Object.fromEntries(entries));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [jobs]);

  // Fetch jobs with filters and pagination
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit,
        };

        if (search.trim()) params.search = search.trim();
        if (jobTypeFilter) params.jobType = jobTypeFilter;
        if (remoteFilter) params.remote = remoteFilter;

        if (statusFilter === "active") params.isActive = true;
        if (statusFilter === "inactive") params.isActive = false;

        const res = await JobService.getJobsOfRecruiter(params);
        const data = res?.data?.data || res?.data || {};

        setJobs(data.jobs || []);
        setPagination({
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
        });
      } catch (error) {
        console.error("Failed to load recruiter jobs:", error);
        notifyError("Failed to load jobs");
        setJobs([]);
        setPagination({ total: 0, totalPages: 1 });
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, jobTypeFilter, remoteFilter, statusFilter, page, limit]);

  // Handle status change
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setStatusDropdownOpen(false);
    setPage(1);
  };

  // Handle search submit
  const handleSearchSubmit = (value) => {
    setSearch(value || searchInput);
    setPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchInput("");
    setSearch("");
    setJobTypeFilter("");
    setRemoteFilter("");
    setStatusFilter("all");
    setPage(1);
  };

  // Refresh jobs with current filters
  const refreshJobs = async () => {
    try {
      const params = {
        page,
        limit,
      };

      if (search.trim()) params.search = search.trim();
      if (jobTypeFilter) params.jobType = jobTypeFilter;
      if (remoteFilter) params.remote = remoteFilter;
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;

      const res = await JobService.getJobsOfRecruiter(params);
      const data = res?.data?.data || res?.data || {};

      setJobs(data.jobs || []);
      setPagination({
        total: data.pagination?.total || 0,
        totalPages: data.pagination?.totalPages || 1,
      });
    } catch (error) {
      console.error("Failed to refresh jobs:", error);
    }
  };

  // Toggle job status
  const handleToggleStatus = async (jobId, currentStatus) => {
    setActionLoading(jobId);
    try {
      await JobService.toggleJobStatus(jobId);
      notifySuccess(`Job ${currentStatus ? "deactivated" : "activated"} successfully`);
      await refreshJobs();
    } catch (error) {
      console.error("Failed to toggle job status:", error);
      notifyError("Failed to update job status");
    } finally {
      setActionLoading(null);
      setOpenDropdownId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-2 font-bold tracking-wider uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Briefcase size={14} />
            Job Details
            <ArrowUpDown size={14} className="ml-1" />
          </button>
        ),
        cell: ({ row }) => {
          const job = row.original;
          const remaining = getRemainingDays(job?.expiration);
          return (
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600">
                  {job?.title || "Untitled Position"}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      <Briefcase size={12} />
                      {formatJobType(job)}
                    </span>
                    {job?.jobLevel && (
                      <span className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                        {job.jobLevel}
                      </span>
                    )}
                  </div>
                  {job?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-gray-400" />
                      {job.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 md:flex">
                <Clock size={14} />
                {remaining}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-bold tracking-wider uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ row }) => {
          const job = row.original;
          const isLoading = actionLoading === job._id;
          const statusLabel = getStatusLabel(job);

          return (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleToggleStatus(job._id, job.isActive)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm transition ${getStatusClass(
                job?.isActive
              )} ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:opacity-80 hover:shadow-md active:scale-95"
              }`}
              title={job.isActive ? "Click to deactivate" : "Click to activate"}
            >
              {isLoading ? (
                <div className="h-2 w-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
              )}
              {statusLabel}
            </button>
          );
        },
      },
      {
        accessorKey: "applications",
        header: ({ column }) => (
          <button
            type="button"
            className="flex items-center gap-1 font-bold tracking-wider uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Applications
            <ArrowUpDown size={14} />
          </button>
        ),
        cell: ({ row }) => {
          const applications = applicationCounts[row.original._id] ?? 0;
          return (
            <div className="text-sm">
              <span className="font-bold text-gray-900">{applications}</span>
              <span className="ml-1 text-gray-500">
                {applications === 1 ? "Application" : "Applications"}
              </span>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const a = applicationCounts[rowA.original._id] ?? 0;
          const b = applicationCounts[rowB.original._id] ?? 0;
          return a - b;
        },
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right font-bold tracking-wider uppercase">Actions</span>
        ),
        cell: ({ row }) => {
          const job = row.original;
          const isDropdownOpen = openDropdownId === job._id;
          const isLoading = actionLoading === job._id;

          return (
            <div className="flex justify-end">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdownId(isDropdownOpen ? null : job._id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                >
                  <MoreVertical size={14} />
                  Actions
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)} />

                    <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                      <Link
                        to={`/recruiter/applications?jobId=${job._id}`}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setOpenDropdownId(null)}
                      >
                        <Tooltip title="View Applications">
                          <Eye size={16} />
                        </Tooltip>
                      </Link>

                      <Link
                        to={`/recruiter/jobs/edit/${job._id}`}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setOpenDropdownId(null)}
                      >
                        <Tooltip title="Edit Job">
                          <Edit size={16} />
                        </Tooltip>
                      </Link>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleToggleStatus(job._id, job.isActive)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : job.isActive ? (
                          <>
                            <Tooltip title="Deactivate Job">
                              <XCircle size={16} />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip title="Activate Job">
                              <CheckCircle size={16} />
                            </Tooltip>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        },
      },
    ],
    [applicationCounts, openDropdownId, actionLoading]
  );

  const table = useReactTable({
    data: jobs,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  const hasActiveFilters = search || jobTypeFilter || remoteFilter || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Jobs
              <span className="ml-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {pagination.total} {pagination.total === 1 ? "Job" : "Jobs"}
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">Manage and track your job postings</p>
          </div>

          <Link
            to="/recruiter/jobs/post"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-600 hover:shadow-xl"
          >
            <Plus size={18} />
            Post New Job
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Search
                placeholder="Search jobs by title, location, tags..."
                allowClear
                size="large"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onSearch={handleSearchSubmit}
                enterButton
                prefix={<SearchIcon size={16} className="text-gray-400" />}
              />
            </div>

            <Select
              size="large"
              placeholder="Job Type"
              value={jobTypeFilter || undefined}
              onChange={(value) => {
                setJobTypeFilter(value || "");
                setPage(1);
              }}
              allowClear
              options={jobTypeOptions}
              className="w-full"
            />

            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm transition hover:border-blue-400"
                onClick={() => setStatusDropdownOpen((prev) => !prev)}
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-blue-600">
                    {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {statusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setStatusDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusChange(option.value)}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${
                          statusFilter === option.value
                            ? "bg-blue-50 font-semibold text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                        {statusFilter === option.value && (
                          <CheckCircle size={16} className="text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <span className="text-sm text-gray-500">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Search: {search}
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                    }}
                    className="hover:text-blue-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {jobTypeFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Type: {jobTypeOptions.find((opt) => opt.value === jobTypeFilter)?.label}
                  <button
                    onClick={() => {
                      setJobTypeFilter("");
                      setPage(1);
                    }}
                    className="hover:text-blue-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Status: {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setPage(1);
                    }}
                    className="hover:text-blue-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="ml-auto text-xs font-medium text-red-600 hover:text-red-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* React Table */}
        <Spin spinning={loading}>
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            {!loading && jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-gray-100 p-6">
                  <SearchIcon size={48} className="text-gray-400" />
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-700">No jobs found</p>
                <p className="text-sm text-gray-500">
                  {hasActiveFilters
                    ? "Try adjusting your filters or search terms"
                    : "Post your first job to get started"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-6 py-4 text-left text-xs text-gray-600"
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="group border-b border-gray-100 transition last:border-none hover:bg-blue-50/50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-5">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <div className="text-sm text-gray-500">
                      Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)}{" "}
                      of {pagination.total} jobs
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowLeft size={18} />
                      </button>

                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setPage(pageNum)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                              page === pageNum
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
}
