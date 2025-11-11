import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  XCircle,
  CheckCircle,
  MapPin,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { notifySuccess, notifyError } from "../../../../../components/Notification";
import { JobService } from "../../../../../services/JobService";
import { Link } from "react-router-dom";

const statusOptions = [
  { label: "All Jobs", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const formatJobType = (job) => job?.jobType?.replace("-", " ") || "N/A";

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
  const [actionLoading, setActionLoading] = useState(null);

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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await JobService.getJobsOfRecruiter();
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

  const handleToggleStatus = async (jobId, currentStatus) => {
    setActionLoading(jobId);
    try {
      await JobService.toggleJobStatus(jobId);
      notifySuccess(`Job ${currentStatus ? "deactivated" : "activated"} successfully`);
    } catch (error) {
      console.error("Failed to toggle job status:", error);
      notifyError("Failed to update job status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (statusFilter === "active") return job?.isActive;
      if (statusFilter === "inactive") return !job?.isActive;
      return true;
    });
  }, [jobs, statusFilter]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setStatusDropdownOpen(false);
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
                  <div>
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
          const statusLabel = getStatusLabel(job);
          return (
            <div>
              <button>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${getStatusClass(
                    job?.isActive
                  )}`}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                  {statusLabel}
                </span>
              </button>
            </div>
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
          return (
            <div className="flex justify-between gap-2">
              <Link
                to={`/recruiter/applications?jobId=${job?._id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-2 text-xs font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              >
                <Eye size={14} />
                View Application
              </Link>
              <Link
                to={`/recruiter/jobs/edit/${job?._id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 py-2 text-xs font-semibold text-white shadow-md transition hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              >
                <Edit size={14} />
                Edit
              </Link>
            </div>
          );
        },
      },
    ],
    [applicationCounts]
  );

  const table = useReactTable({
    data: filteredJobs,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-2">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Jobs
              <span className="ml-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/recruiter/jobs/post"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-600 hover:shadow-xl"
            >
              <Plus size={18} />
              Post New Job
            </Link>

            <div className="relative">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                onClick={() => setStatusDropdownOpen((prev) => !prev)}
              >
                <Filter size={16} />
                <span className="hidden md:inline">Status:</span>
                <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {statusOptions.find((option) => option.value === statusFilter)?.label}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {statusDropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
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
              )}
            </div>
          </div>
        </div>

        {/* React Table */}
        <div className="mb-2 overflow-hidden rounded-2xl bg-white shadow-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-4 text-sm text-gray-500">Loading your jobs...</p>
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="rounded-full bg-gray-100 p-6">
                <Search size={48} className="text-gray-400" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700">No jobs found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-6 py-4 text-left text-xs text-gray-600">
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

              {/* Pagination */}
              {table.getPageCount() > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-gray-100 px-6 py-4">
                  <button
                    type="button"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                    <button
                      key={pageIndex}
                      type="button"
                      onClick={() => table.setPageIndex(pageIndex)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                        table.getState().pagination.pageIndex === pageIndex
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 !text-white shadow-lg"
                          : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {pageIndex + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
