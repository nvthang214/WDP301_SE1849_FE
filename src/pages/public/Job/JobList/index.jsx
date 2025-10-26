import React, { useEffect, useState } from "react";
import { JobService } from "../../../../services/JobService";
import { UserService } from "../../../../services/UserService";
import { CategoryService } from "../../../../services/CategoryService";
import { useResponsive } from "../../../../hook/useResponsive";
import JobCard from "../../../../components/Card/JobCard";
import FilterSidebar from "../JobList/components/FilterSidebar";
import { useSearchParams, useLocation } from "react-router-dom";

const jobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP", "TEMPORARY", "CONTRACT BASE"];

const salaryRanges = [
  { label: "$10 - $100", min: 10, max: 100 },
  { label: "$100 - $1,000", min: 100, max: 1000 },
  { label: "$1,000 - $10,000", min: 1000, max: 10000 },
  { label: "$10,000 - $100,000", min: 10000, max: 100000 },
  { label: "$100,000 Up", min: 100000, max: 1000000 },
];

const initialFilters = {
  jobType: "",
  experience: "",
  categoryId: "",
  minSalary: undefined,
  maxSalary: undefined,
  isActive: undefined,
};
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
// Main Job List Component
export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  //fetch categories once
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.getAllCategories();
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Search & filter states
  const [search, setSearch] = useState(category || "");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState(() => ({ ...initialFilters }));
  const [draftFilters, setDraftFilters] = useState(() => ({ ...initialFilters }));

  // Sidebar state
  const [showFilter, setShowFilter] = useState(false);
  useEffect(() => {
    if (showFilter) {
      setDraftFilters({ ...filters });
    }
  }, [showFilter, filters]);

  // Responsive hook
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Tính số cột dựa trên responsive
  let gridCols = "grid-cols-1";
  if (isDesktop) gridCols = "grid-cols-3";
  else if (isTablet) gridCols = "grid-cols-2";
  else if (isMobile) gridCols = "grid-cols-1";

  //////////////////////////////////////////
  // Fetch jobs with filters & pagination
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };
      if (search) params.search = search;
      if (location) params.location = location;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.experience) params.experience = filters.experience;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minSalary !== undefined) params.minSalary = filters.minSalary;
      if (filters.maxSalary !== undefined) params.maxSalary = filters.maxSalary;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;
      if (filters.remote !== undefined) params.remote = filters.remote ? "true" : "false";
      // Xóa các param undefined/null/rỗng
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      let flag = "";

      try {
        const currentUser = await UserService.fetchMe();
        flag = currentUser.data ? "isFavorite" : "";
      } catch (error) {
        // Do nothing
      }

      const res = await JobService.getJobs(flag, params);
      setJobs(res.data.jobs || []);
      setPagination(
        res.data.pagination || {
          total: 0,
          page: 1,
          limit: 15,
          totalPages: res.data.totalPages || 1,
        }
      );
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      setPagination({ total: 0, page: 1, limit: 15, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [search, location, filters, page, limit]);

  //////////////////////////////////////
  // Xử lý submit search/filter
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 px-8 py-6">
      <ScrollToTop />
      {/* Search bar */}
      <form className="mb-4 flex flex-col gap-2" onSubmit={handleSearch}>
        <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
          <div className="flex flex-1 items-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-400">
              <circle cx="9" cy="9" r="7" strokeWidth="2" />
              <path d="M16 16L13.5 13.5" strokeWidth="2" />
            </svg>
            <input
              className="flex-1 bg-transparent text-base outline-none"
              placeholder="Search by: Job title, Position, Keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="ml-2 flex items-center gap-2 rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
            onClick={() => setShowFilter(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-600">
              <path d="M3 6h14M5 12h10M7 18h6" strokeWidth="2" />
            </svg>
            Filters
          </button>
          <button
            type="submit"
            className="ml-2 inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] px-5 py-2 font-semibold !text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--color-primary-600)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] focus-visible:outline-none"
          >
            Find Job
          </button>
        </div>
        {/* Popular searches */}
        <div className="flex flex-wrap gap-3 pl-2 text-sm text-gray-500">
          <span>Popular searches:</span>
          {[
            "Fullstack",
            "Frontend",
            "Backend",
            "Development",
            "PHP",
            "Laravel",
            "Bootstrap",
            "Developer",
            "Team Lead",
            "Product Testing",
            "Javascript",
            "ReactJS",
          ].map((tag) => (
            <span
              key={tag}
              className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 font-medium hover:bg-blue-100 hover:text-blue-600"
              onClick={() => {
                setSearchInput(tag);
                setSearch(tag);
                setPage(1);
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </form>

      {/* Sidebar Filter */}
      <FilterSidebar
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={draftFilters}
        setFilters={setDraftFilters}
        onApply={() => {
          setShowFilter(false);
          setPage(1);
          setFilters({ ...draftFilters });
        }}
        categories={categories}
        jobTypes={jobTypes}
        salaryRanges={salaryRanges}
      />

      {/* Job Cards Grid */}
      <div>
        {loading ? (
          <div className="w-full py-10 text-center text-gray-400">Loading...</div>
        ) : (
          <div className={`grid ${gridCols} gap-6`}>
            {jobs.map((job, idx) => (
              <JobCard
                key={job._id || idx}
                jobId={job._id}
                title={job.title}
                type={job.jobType}
                salary={`$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`}
                company={job.companyName}
                location={job.city}
                logo={job.company?.logo}
                isFavorite={job.isFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)] disabled:cursor-not-allowed disabled:opacity-30"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor">
            <path
              d="M11 15L7 11L11 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
              n === page
                ? "bg-[var(--color-primary-500)] !text-white shadow-[var(--shadow-md)]"
                : "border border-transparent bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
            }`}
            onClick={() => handlePageChange(n)}
          >
            {n.toString().padStart(2, "0")}
          </button>
        ))}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)] disabled:cursor-not-allowed disabled:opacity-30"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pagination.totalPages}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor">
            <path
              d="M7 7L11 11L7 15"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
