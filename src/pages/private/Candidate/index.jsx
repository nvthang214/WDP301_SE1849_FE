import React, { useEffect, useMemo, useState } from "react";
import { Button, Pagination, Skeleton } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";
import { CandidateService } from "../../../services/CandidateService";
import { notifyError } from "../../../components/Notification";
import { EnvironmentOutlined } from "@ant-design/icons";
import { BriefcaseBusiness, Bookmark, Bell, ArrowRight } from "lucide-react";
import ROUTER from "../../../router/ROUTER";

const PAGE_SIZE = 10;

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  let colorClasses = "bg-amber-50 text-amber-600 border border-amber-200";

  if (["active", "approved", "hired"].includes(status.toLowerCase())) {
    colorClasses = "bg-green-50 text-green-600 border border-green-200";
  } else if (["rejected", "declined"].includes(status.toLowerCase())) {
    colorClasses = "bg-red-50 text-red-500 border border-red-200";
  } else if (["interview", "shortlisted"].includes(status.toLowerCase())) {
    colorClasses = "bg-blue-50 text-blue-500 border border-blue-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${colorClasses}`}
    >
      <span />
      {label}
    </span>
  );
};


const AppliedJobRow = ({ application, onViewDetails }) => {
  const job = application?.job || {};

  const location =
    job.location || [job.city, job.country].filter(Boolean).join(", ") || "--";
  const appliedAt = application?.appliedAt || application?.createdAt;

  const salaryLabel = useMemo(() => {
    const { minSalary, maxSalary, salaryType } = job;
    const suffix = salaryType ? `/${String(salaryType).toLowerCase()}` : "";

    if (minSalary && maxSalary) {
      return `$${Number(minSalary).toLocaleString()} - $${Number(
        maxSalary
      ).toLocaleString()}${suffix}`;
    }
    if (minSalary) return `$${Number(minSalary).toLocaleString()}+${suffix}`;
    if (maxSalary)
      return `Up to $${Number(maxSalary).toLocaleString()}${suffix}`;
    return "Negotiable";
  }, [job]);

  const tagNames = Array.isArray(job.tags)
    ? job.tags
        .map((tag) => (typeof tag === "string" ? tag : tag?.name))
        .filter(Boolean)
        .slice(0, 3)
    : [];

  return (
    <div className="grid grid-cols-12 items-center gap-4 border-t border-neutral-100 px-6 py-5">
      <div className="col-span-12 flex flex-col gap-4 md:col-span-5 md:flex-row md:items-center">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-600">
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={job.company?.name || job.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>
              {(job.company?.name || job.title || "?")
                .split(" ")
                .slice(0, 2)
                .map((word) => word.charAt(0).toUpperCase())
                .join("")
                .slice(0, 2)}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-base font-semibold text-neutral-900">
            {job.title || "Untitled Job"}
          </span>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
            <span className="font-medium text-neutral-600">
              {job.company?.name || "Company"}
            </span>
            <span className="inline-flex items-center gap-1">
              <EnvironmentOutlined className="text-neutral-300" />
              {location}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-neutral-300"></span>
              {salaryLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagNames.map((tag) => (
              <span
                key={`${application.applicationId || application._id}-${tag}`}
                className="rounded-full bg-neutral-100 px-3 py-[2px] text-[11px] font-medium text-neutral-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-6 text-sm text-neutral-500 md:col-span-3 md:text-center">
        {appliedAt ? dayjs(appliedAt).format("MMM D, YYYY HH:mm") : "--"}
      </div>

      <div className="col-span-6 md:col-span-2 md:text-center">
        <StatusBadge status={application.status} />
      </div>

      <div className="col-span-12 flex justify-start md:col-span-2 md:justify-end">
        <Button
          className="rounded-full bg-[var(--color-primary-500)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-600)]"
          onClick={() => onViewDetails?.(job?._id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};


const CandidateOverview = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProfileMissing, setIsProfileMissing] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const avatar = (() => {
    if (!user?.avatar) return null;
    try {
      return typeof user.avatar === "string" ? JSON.parse(user.avatar) : user.avatar;
    } catch {
      return null;
    }
  })();

  const userId = useMemo(
    () => user?._id || user?.id || user?.userId || null,
    [user]
  );

  const fetchAppliedJobs = async (candidateId, showLoader = true) => {
    if (!candidateId) return;

    if (showLoader) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    try {
      const response = await CandidateService.getCandidateAppliedJobs(candidateId);
      if (!response || response.isError) {
        throw new Error(
          response?.msg || "Không thể lấy danh sách công việc đã ứng tuyển."
        );
      }
      const data = Array.isArray(response.data) ? response.data : [];
      setAppliedJobs(data);
    } catch (error) {
      const message = error?.message || "Không thể tải dữ liệu.";
      setAppliedJobs([]);
      setErrorMessage(message);
      notifyError(message);
    } finally {
      if (showLoader) setIsLoading(false);
      else setIsRefreshing(false);
    }
  };

  const fetchFavoriteJobsCount = async (candidateId) => {
    if (!candidateId) return;

    try {
      const response = await CandidateService.getCandidateFavoriteJobs(candidateId);
      if (!response || response.isError) {
        throw new Error(response?.msg || "Không thể lấy danh sách công việc yêu thích.");
      }
      const data = Array.isArray(response.data) ? response.data : [];
      const total = data.filter((item) => item && item.job).length;
      setFavoriteCount(total);
    } catch (error) {
      console.error(error);
      setFavoriteCount(0);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      setIsLoading(false);
      setErrorMessage("Không tìm thấy thông tin ứng viên, vui lòng đăng nhập lại.");
      notifyError("Không tìm thấy thông tin ứng viên, vui lòng đăng nhập lại.");
      return;
    }

    CandidateService.getCandidateProfile(userId)
      .then((response) => {
        if (!response || response.isError || !response.data) {
          setIsProfileMissing(true);
          return;
        }
        setIsProfileMissing(false);
      })
      .catch(() => {
        setIsProfileMissing(true);
      });

    fetchAppliedJobs(userId, true);
    fetchFavoriteJobsCount(userId);
  }, [loading, userId]);

  const handleViewDetails = (jobId) => {
    if (!jobId) return;
    navigate(ROUTER.CANDIDATE_JOB_DETAIL.replace(":id", jobId));
  };

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
    const totalPages = Math.max(1, Math.ceil(visibleAppliedJobs.length / PAGE_SIZE) || 1);
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev));
  }, [visibleAppliedJobs.length]);

 
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">
              Hello, {user?.firstName + " " + user?.lastName}
            </h1>
          </div>


          <div className="flex gap-6 mt-4 lg:mt-0">
            <div className="flex items-center justify-between w-52 rounded-xl bg-blue-50 px-6 py-5 shadow-sm">
              <div>
                <p className="text-2xl font-semibold text-neutral-900">
                  {totalApplied}
                </p>
                <p className="text-sm text-neutral-500">Applied jobs</p>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <BriefcaseBusiness className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="flex items-center justify-between w-52 rounded-xl bg-yellow-50 px-6 py-5 shadow-sm">
              <div>
                <p className="text-2xl font-semibold text-neutral-900">{favoriteCount}</p>
                <p className="text-sm text-neutral-500">Favorite jobs</p>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bookmark className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        

    {isProfileMissing ? (
  <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-blue-400 px-6 py-5 text-white shadow-sm sm:flex-row">
    
    <div className="flex items-center gap-4">
      <img
        src={avatar?.url}
        alt="User avatar"
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <p className="text-base font-semibold">
          Your profile editing is not completed.
        </p>
        <p className="text-sm opacity-80">
          Complete your profile editing & build your custom Resume
        </p>
      </div>
    </div>

    
    <Button
      href={ROUTER.CANDIDATE_PROFILE}
      className="flex items-center gap-2 rounded-lg border-none bg-white px-5 py-2 font-semibold text-red-500 hover:bg-red-50"
    >
      Edit Profile
      <ArrowRight className="w-4 h-4" />
    </Button>
  </div>
) : null}


        {/*  APPLIED JOBS */}
        <div className=" bg-white shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Recently Applied
              </h3>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  active
                  paragraph={{ rows: 1 }}
                  className="!rounded-2xl"
                />
              ))
            ) : errorMessage ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
                {errorMessage}
              </div>
            ) : visibleAppliedJobs.length ? (
              <div className="overflow-hidden">
                <div className="grid grid-cols-12 gap-4 bg-neutral-50 px-6 py-4 text-[12px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
                  <span className="col-span-5 hidden md:block">Jobs</span>
                  <span className="col-span-12 md:col-span-3 md:text-center">
                    Date Applied
                  </span>
                  <span className="col-span-12 md:col-span-2 md:text-center">
                    Status
                  </span>
                  <span className="col-span-12 md:col-span-2 md:text-right">
                    Action
                  </span>
                </div>
                {paginatedAppliedJobs.map((application) => (
                  <AppliedJobRow
                    key={application.applicationId || application._id}
                    application={application}
                    onViewDetails={handleViewDetails}
                  />
                ))}
                {visibleAppliedJobs.length > PAGE_SIZE && (
                  <div className="flex justify-end border-t border-neutral-100 bg-white px-6 py-4">
                    <Pagination
                      current={currentPage}
                      pageSize={PAGE_SIZE}
                      total={visibleAppliedJobs.length}
                      showSizeChanger={false}
                      onChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 py-12 text-sm text-neutral-500">
                You haven't applied to any jobs yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CandidateOverview;
