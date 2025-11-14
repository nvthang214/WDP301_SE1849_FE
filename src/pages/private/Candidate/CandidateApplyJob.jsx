import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Empty, Pagination, Skeleton, Tag, Typography } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CandidateService } from "../../../services/CandidateService";
import { notifyError } from "../../../components/Notification";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";
import useAuthStore from "../../../store/useAuthStore";

const { Title, Text } = Typography;
const PAGE_SIZE = 10;

const STATUS_META = {
  pending: {
    label: "Pending",
    className: "border border-amber-200 bg-amber-50 text-amber-600",
  },
  reviewing: {
    label: "Reviewing",
    className: "border border-blue-200 bg-blue-50 text-blue-600",
  },
  interview: {
    label: "Interview",
    className: "border border-indigo-200 bg-indigo-50 text-indigo-600",
  },
  active: {
    label: "Active",
    className: "border border-green-200 bg-green-50 text-green-600",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border border-teal-200 bg-teal-50 text-teal-600",
  },
  hired: {
    label: "Hired",
    className: "border border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  rejected: {
    label: "Rejected",
    className: "border border-red-200 bg-red-50 text-red-500",
  },
};

const toTitleCase = (value = "") =>
  value
    .toString()
    .replace(/[_-]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());

const formatSalaryRange = (job) => {
  const { minSalary, maxSalary, salaryType } = job;
  const suffix = salaryType ? `/${salaryType.toString().toLowerCase()}` : "";

  if (minSalary && maxSalary) {
    return `$${Number(minSalary).toLocaleString()} - $${Number(maxSalary).toLocaleString()}${suffix}`;
  }

  if (minSalary) return `$${Number(minSalary).toLocaleString()}+${suffix}`;
  if (maxSalary) return `Up to $${Number(maxSalary).toLocaleString()}${suffix}`;
  return "Negotiable";
};

const formatLocation = (job) => {
  const { location, city, country } = job;
  if (location) return location;
  return [city, country].filter(Boolean).join(", ") || "Location not specified";
};

const deriveStatusMeta = (application) => {
  const fallback = application.job?.isActive ? "active" : "pending";
  const rawStatus = (application.status || fallback || "pending").toString().toLowerCase();
  const meta = STATUS_META[rawStatus];
  if (meta) return meta;
  return {
    label: toTitleCase(rawStatus),
    className: "bg-neutral-100 text-neutral-700",
  };
};

const formatAppliedAt = (date) => {
  if (!date) return "--";
  return dayjs(date).format("MMM D, YYYY HH:mm");
};

const getCompanyInitials = (job) => {
  const name = job.company?.name || job.title || "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

const getVisibleTags = (job) => {
  if (!Array.isArray(job.tags)) return [];
  return job.tags
    .map((tag) => (typeof tag === "string" ? tag : tag?.name))
    .filter(Boolean)
    .slice(0, 3);
};

const CandidateApplyJob = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleAppliedJobs = useMemo(
    () => appliedJobs.filter((item) => item && item.job),
    [appliedJobs]
  );
  const totalApplied = visibleAppliedJobs.length;
  const paginatedAppliedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleAppliedJobs.slice(start, start + PAGE_SIZE);
  }, [visibleAppliedJobs, currentPage]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalApplied / PAGE_SIZE) || 1);
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [totalApplied]);

  const fetchAppliedJobs = useCallback(async (id, showFullLoader = true) => {
    if (!id) return;

    if (showFullLoader) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await CandidateService.getCandidateAppliedJobs(id);
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể tải danh sách công việc đã ứng tuyển.");
      }

      const data = Array.isArray(response?.data) ? response.data : [];
      setAppliedJobs(data);
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể tải danh sách công việc đã ứng tuyển.");
      setAppliedJobs([]);
    } finally {
      if (showFullLoader) setIsLoading(false);
      else setIsRefreshing(false);
    }
  }, []);
  // lấy user từ authstore
  const { user, loading } = useAuthStore();
  const userId = useMemo(() => user?._id || user?.id || user?.userId || null, [user]);

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      notifyError("Không tìm thấy thông tin ứng viên, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    fetchAppliedJobs(userId, true);
  }, [loading, fetchAppliedJobs, userId]);

  const handleRefresh = () => {
    if (!userId || isRefreshing) return;
    fetchAppliedJobs(userId, false);
  };

  const renderHeader = () => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Title level={4} className="!mb-0 text-neutral-900">
          Applied Jobs{" "}
          <span className="text-sm font-semibold text-neutral-900">({totalApplied})</span>
        </Title>
      </div>
    </div>
  );

  const renderSkeletonRows = () => (
    <div className="flex flex-col gap-3 px-6 py-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          active
          avatar
          paragraph={{ rows: 2, width: ["60%", "40%"] }}
          className="!rounded-2xl border border-neutral-100 px-4 py-4"
        />
      ))}
    </div>
  );

  const navigateToJobDetail = (jobId) => {
    navigate(ROUTER.CANDIDATE_JOB_DETAIL.replace(":id", jobId));
  };

  const renderJobRow = (application) => {
    const { job, applicationId, _id } = application;
    if (!job) return null;

    const recordId = applicationId || _id || job._id;
    const statusMeta = deriveStatusMeta(application);
    const locationLabel = formatLocation(job);
    const salaryLabel = formatSalaryRange(job);
    const jobTypeLabel = job.jobType ? toTitleCase(job.jobType) : null;
    const visibleTags = getVisibleTags(job);

    return (
      <div
        key={recordId}
        className="grid grid-cols-12 items-center gap-4 border-b border-neutral-100 px-6 py-6 text-sm transition-all hover:bg-blue-50/40"
      >
        <div className="col-span-12 flex flex-col gap-4 md:col-span-5 md:flex-row md:items-center">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white text-base font-semibold text-neutral-600 shadow-sm">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company?.name || job.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{getCompanyInitials(job)}</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-base font-semibold text-neutral-900">
              {job.title || "Untitled Job"}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              {job.company?.name && (
                <span className="font-medium text-neutral-600">{job.company.name}</span>
              )}
              <span className="flex items-center gap-1">
                <EnvironmentOutlined className="text-neutral-300" />
                {locationLabel}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-neutral-300"></span>
                {salaryLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {jobTypeLabel && (
                <Tag
                  color="blue"
                  className="!m-0 !rounded-full !border-blue-200 !bg-blue-50 !px-3 !py-[2px] !text-[11px] !font-semibold !text-blue-600"
                >
                  {jobTypeLabel}
                </Tag>
              )}
              {visibleTags.map((tag) => (
                <Tag
                  key={`${recordId}-${tag}`}
                  color="default"
                  className="!m-0 !rounded-full !border-neutral-200 !bg-neutral-50 !px-3 !py-[2px] !text-[11px] !text-neutral-600"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-6 text-neutral-500 md:col-span-3 md:text-center">
          {formatAppliedAt(
            application.appliedAt || application.appliedDate || application.createdAt
          )}
        </div>

        <div className="col-span-6 md:col-span-2 md:text-center">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
        </div>

        <div className="col-span-12 flex justify-start md:col-span-2 md:justify-end">
          <Button
            className="hover:bg-primary-600 bg-primary-500 rounded-full px-5 font-semibold"
            onClick={() => navigateToJobDetail(job._id)}
          >
            View Details
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return renderSkeletonRows();

    if (!visibleAppliedJobs.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12">
          <Empty
            description="You haven't applied to any jobs yet."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-12 items-center gap-4 border-b border-neutral-100 bg-neutral-50 px-6 py-4 text-[12px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
          <span className="col-span-5 hidden md:block">Jobs</span>
          <span className="col-span-12 md:col-span-3 md:text-center">Date Applied</span>
          <span className="col-span-12 md:col-span-2 md:text-center">Status</span>
          <span className="col-span-12 md:col-span-2 md:text-right">Action</span>
        </div>
        <div className="divide-y divide-neutral-100">{paginatedAppliedJobs.map(renderJobRow)}</div>
        {totalApplied > PAGE_SIZE && (
          <div className="flex justify-end border-t border-neutral-100 bg-white px-6 py-4">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalApplied}
              showSizeChanger={false}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        {renderHeader()}
        <div>{renderContent()}</div>
      </section>
    </div>
  );
};

export default CandidateApplyJob;
