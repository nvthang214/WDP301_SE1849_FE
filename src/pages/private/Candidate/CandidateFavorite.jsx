import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Empty, Skeleton, Tag, Typography } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";
import { CandidateService } from "../../../services/CandidateService";
import { notifyError } from "../../../components/Notification";
import useAuthStore from "../../../store/useAuthStore";

const { Title, Text } = Typography;

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

const formatFavoritedAt = (value) => {
  if (!value) return "--";
  return dayjs(value).format("MMM D, YYYY HH:mm");
};

const getApplicationStatusLabel = (application) => {
  const rawStatus = application?.status || application?.state || "Pending";
  return toTitleCase(rawStatus);
};

const getJobStatusClass = (statusLabel) => {
  const normalized = statusLabel?.toLowerCase?.() || "";

  if (["pending", "processing"].includes(normalized)) {
    return "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600";
  }

  if (["accepted", "approved", "active", "open", "hired"].includes(normalized)) {
    return "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600";
  }

  if (["rejected", "closed", "cancelled", "expired"].includes(normalized)) {
    return "rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600";
  }

  return "rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-600";
};

const CandidateFavorite = () => {
  const navigate = useNavigate();
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user, loading } = useAuthStore();
  const userId = useMemo(() => user?._id || user?.id || user?.userId || null, [user]);
  const visibleFavorites = useMemo(
    () => favoriteJobs.filter((item) => item && item.job),
    [favoriteJobs]
  );
  const totalFavorites = visibleFavorites.length;

  const fetchFavorites = useCallback(
    async (id, showFullLoader = true) => {
      if (!id) return;

      if (showFullLoader) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const response = await CandidateService.getCandidateFavoriteJobs(id);
        if (response?.isError) {
          throw new Error(response?.msg || "Unable to fetch favorite jobs.");
        }

        const data = Array.isArray(response?.data) ? response.data : [];
        setFavoriteJobs(data);
      } catch (error) {
        console.error(error);
        notifyError(error.message || "Unable to fetch favorite jobs.");
        setFavoriteJobs([]);
      } finally {
        if (showFullLoader) setIsLoading(false);
        else setIsRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      notifyError("Không tìm thấy thông tin ứng viên, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    fetchFavorites(userId, true);
  }, [loading, userId, fetchFavorites]);

  const handleRefresh = () => {
    if (!userId || isRefreshing) return;
    fetchFavorites(userId, false);
  };

  const navigateToJobDetail = (jobId) => {
    navigate(ROUTER.JOB_DETAIL.replace(":id", jobId));
  };

  const renderSkeleton = () => (
    <div className="grid gap-4 px-1 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          active
          avatar
          paragraph={{ rows: 2, width: ["60%", "40%"] }}
          className="!rounded-2xl border border-neutral-100 px-4 py-5"
        />
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderSkeleton();

    if (!visibleFavorites.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12">
          <Empty
            description="You have not saved any jobs yet."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button type="primary" ghost onClick={handleRefresh} disabled={isRefreshing}>
            Refresh List
          </Button>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <div className="hidden bg-neutral-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:grid sm:grid-cols-[minmax(0,1fr)_12rem_9rem_9rem] sm:items-center sm:gap-6">
          <div>Jobs</div>
          <div className="text-center">Date Saved</div>
          <div className="text-center">Status</div>
          <div className="text-right">Action</div>
        </div>
        <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:hidden">
          <span>Jobs</span>
          <span>Date Saved</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-neutral-100">
          {visibleFavorites.map(({ favoriteId, job, favoritedAt, application }) => {
            const favoriteKey = favoriteId || job._id;
            const salaryLabel = formatSalaryRange(job);
            const locationLabel = formatLocation(job);
            const visibleTags = getVisibleTags(job);
            const jobTypeLabel = job.jobType ? toTitleCase(job.jobType) : null;
            const statusLabel = getApplicationStatusLabel(application);
            const statusClass = getJobStatusClass(statusLabel);

            return (
              <div
                key={favoriteKey}
                className="flex flex-col gap-4 px-6 py-5 sm:grid sm:grid-cols-[minmax(0,1fr)_12rem_9rem_9rem] sm:items-center sm:gap-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white text-base font-semibold text-neutral-600">
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
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-[2px]">
                      <span className="text-base font-semibold text-neutral-900">
                        {job.title || "Untitled Job"}
                      </span>
                      {job.company?.name && (
                        <span className="text-sm font-medium text-neutral-500">
                          {job.company.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <EnvironmentOutlined className="text-neutral-300" />
                        {locationLabel}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-neutral-300"></span>
                        {salaryLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                          key={`${favoriteKey}-${tag}`}
                          color="default"
                          className="!m-0 !rounded-full !border-neutral-200 !bg-neutral-50 !px-3 !py-[2px] !text-[11px] !text-neutral-600"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-neutral-500 sm:justify-center sm:text-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 sm:hidden">
                      Date Saved
                    </span>
                  <span>{formatFavoritedAt(favoritedAt)}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-center">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400 sm:hidden">
                      Status
                    </span>
                  <span className={statusClass}>{statusLabel}</span>
                </div>
                <div className="flex justify-end sm:justify-end">
                  <Button onClick={() => navigateToJobDetail(job._id)}>
                    Apply Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Title level={4} className="!mb-0 text-neutral-900">
            Favorite Jobs <Text className="text-sm font-semibold text-neutral-400">({totalFavorites})</Text>
          </Title>
        </div>
        {renderContent()}
      </section>
    </div>
  );
};

export default CandidateFavorite;
