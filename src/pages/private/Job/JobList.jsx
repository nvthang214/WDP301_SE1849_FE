import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { JobService } from "../../../services/JobService";
import { useResponsive } from "../../../hook/useResponsive";
import { useWindowSize } from "../../../hook/useWindowSize";
import { useElementSize } from "../../../hook/useElementSize";

// ...typeColor, jobTypes, experienceLevels...

const typeColor = {
  "FULL-TIME": {
    bg: "var(--color-primary-100)",
    color: "var(--color-primary-700)",
  },
  "PART-TIME": { bg: "var(--color-secondary-500)", color: "#fff" },
  INTERNSHIP: { bg: "var(--color-accent-500)", color: "#fff" },
};

const jobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP"];
const experienceLevels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead"];
const categories = [
  "All Category",
  "Developments",
  "Business",
  "Finance & Accounting",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Photography & Video",
];

const salaryRanges = [
  { label: "$10 - $100", min: 10, max: 100 },
  { label: "$100 - $1,000", min: 100, max: 1000 },
  { label: "$1,000 - $10,000", min: 1000, max: 10000 },
  { label: "$10,000 - $100,000", min: 10000, max: 100000 },
  { label: "$100,000 Up", min: 100000, max: 1000000 },
];

// Job Card Component
const JobCard = ({ job }) => {
  const color = typeColor[job.jobType?.toUpperCase()] || {
    bg: "var(--color-neutral-100)",
    color: "var(--color-neutral-900)",
  };
  return (
    <Link to={`/jobs/${job._id}`} className="block" style={{ textDecoration: "none" }}>
      <div
        className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 shadow-none hover:shadow transition relative cursor-pointer"
        style={{
          background: "linear-gradient(90deg, #fff 80%, #fffbe9 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: color.bg, color: color.color }}
          >
            {job.jobType}
          </span>
          <span className="text-gray-400 text-md ml-2">
            Salary:{" "}
            {job.minSalary && job.maxSalary
              ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
              : "Negotiable"}
          </span>
        </div>
        <h3 className="font-semibold text-base mb-2">{job.title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={
              job.company?.logo ||
              "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
            }
            alt="logo"
            className="w-8 h-8 rounded"
          />
          <div>
            <div className="font-medium text-sm">{job.company?.name || "Company"}</div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                className="inline-block mr-1 text-gray-400"
              >
                <path d="M7 12s5-3.33 5-7A5 5 0 1 0 2 5c0 3.67 5 7 5 7z" strokeWidth="1.2" />
              </svg>
              {/* Sửa location: ưu tiên city, country, remote */}
              {job.city && job.country
                ? `${job.city}, ${job.country}`
                : job.city || job.country || (job.remote ? "Remote" : "N/A")}
              {job.remote && <span className="ml-2 text-green-600 font-semibold">(Remote)</span>}
            </div>
          </div>
        </div>
        <button
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100"
          type="button"
          tabIndex={-1}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" className="text-gray-400">
            <path
              d="M5 8.5C5 6.01472 7.01472 4 9.5 4C11.9853 4 14 6.01472 14 8.5C14 12.5 9.5 16 9.5 16C9.5 16 5 12.5 5 8.5Z"
              strokeWidth="1.3"
            />
          </svg>
        </button>
      </div>
    </Link>
  );
};

// Sidebar Filter Component giữ nguyên...

function FilterSidebar({ open, onClose, filters, setFilters, onApply }) {
  const [salary, setSalary] = useState([filters.salary_min || 0, filters.salary_max || 120000]);
  const [customSalary, setCustomSalary] = useState(false);

  useEffect(() => {
    setSalary([filters.salary_min || 0, filters.salary_max || 120000]);
  }, [filters.salary_min, filters.salary_max]);

  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${open ? "opacity-30" : "opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-[320px] bg-white shadow-xl z-50 transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="font-semibold text-lg">Filters</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <svg width="24" height="24" fill="none" stroke="currentColor">
              <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto h-[calc(100vh-64px)]">
          {/* Category */}
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">Industry</div>
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`py-1 px-2 rounded cursor-pointer ${filters.category === cat ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}`}
                  onClick={() =>
                    setFilters((f) => ({ ...f, category: cat === "All Category" ? "" : cat }))
                  }
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          {/* Job Type */}
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">Job Type</div>
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 mb-1 cursor-pointer">
                <input
                  type="radio"
                  name="job_type"
                  checked={filters.job_type === type}
                  onChange={() => setFilters((f) => ({ ...f, job_type: type }))}
                />
                <span>{type.replace("-", " ")}</span>
              </label>
            ))}
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="radio"
                name="job_type"
                checked={!filters.job_type}
                onChange={() => setFilters((f) => ({ ...f, job_type: "" }))}
              />
              <span>All</span>
            </label>
          </div>
          {/* Salary */}
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">Salary (yearly)</div>
            <div className="flex flex-col gap-1">
              {salaryRanges.map((range, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="salary"
                    checked={
                      !customSalary &&
                      filters.salary_min === range.min &&
                      filters.salary_max === range.max
                    }
                    onChange={() => {
                      setCustomSalary(false);
                      setFilters((f) => ({ ...f, salary_min: range.min, salary_max: range.max }));
                    }}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="salary"
                  checked={customSalary}
                  onChange={() => setCustomSalary(true)}
                />
                <span>Custom</span>
              </label>
              {customSalary && (
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-20"
                    placeholder="Min"
                    value={salary[0]}
                    onChange={(e) => {
                      setSalary([+e.target.value, salary[1]]);
                      setFilters((f) => ({ ...f, salary_min: +e.target.value }));
                    }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-20"
                    placeholder="Max"
                    value={salary[1]}
                    onChange={(e) => {
                      setSalary([salary[0], +e.target.value]);
                      setFilters((f) => ({ ...f, salary_max: +e.target.value }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {/* Remote Job */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.remote || false}
                onChange={(e) => setFilters((f) => ({ ...f, remote: e.target.checked }))}
              />
              <span>Remote Job</span>
            </label>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
            onClick={onApply}
            type="button"
          >
            Apply Filter
          </button>
        </div>
      </aside>
    </div>
  );
}

// Main Job List Component
export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });

  // Search & filter states
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    job_type: "",
    experience_level: "",
    category: "",
    salary_min: undefined,
    salary_max: undefined,
    remote: false,
  });

  // Sidebar state
  const [showFilter, setShowFilter] = useState(false);

  // Responsive hook
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Window size hook
  const { width, height } = useWindowSize();

  // Element size hook for grid container
  const gridRef = useRef(null);
  const { width: gridWidth } = useElementSize(gridRef);

  // Tính số cột dựa trên responsive
  let gridCols = "grid-cols-1";
  if (isDesktop) gridCols = "grid-cols-3";
  else if (isTablet) gridCols = "grid-cols-2";
  else if (isMobile) gridCols = "grid-cols-1";

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
      if (filters.job_type) params.job_type = filters.job_type;
      if (filters.experience_level) params.experience_level = filters.experience_level;
      if (filters.category) params.category = filters.category;
      if (filters.salary_min !== undefined) params.salary_min = filters.salary_min;
      if (filters.salary_max !== undefined) params.salary_max = filters.salary_max;
      if (filters.remote) params.remote = true;

      // Xóa các param undefined/null/rỗng
      Object.keys(params).forEach(
        (key) =>
          (params[key] === undefined || params[key] === "" || params[key] === false) &&
          delete params[key]
      );

      const res = await JobService.getJobs(params);
      // Nếu backend trả về { data, pagination }
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

  // Xử lý submit search/filter
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className=" bg-gray-50 py-6 relative flex-1">
      {/* Search bar giống ảnh */}
      <form className="flex flex-col gap-2 mb-4" onSubmit={handleSearch}>
        <div className="flex items-center bg-white rounded-xl shadow-sm px-3 py-2 gap-2 border">
          <div className="flex items-center flex-1 gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-400">
              <circle cx="9" cy="9" r="7" strokeWidth="2" />
              <path d="M16 16L13.5 13.5" strokeWidth="2" />
            </svg>
            <input
              className="flex-1 outline-none bg-transparent text-base"
              placeholder="Search by: Job title, Position, Keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center flex-1 gap-2 border-l pl-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" className="text-blue-600">
              <path d="M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16Z" strokeWidth="2" />
              <path d="M10 6v4l2 2" strokeWidth="2" />
            </svg>
            <input
              className="flex-1 outline-none bg-transparent text-base"
              placeholder="City, state or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded px-3 py-2 ml-2"
            onClick={() => setShowFilter(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-600">
              <path d="M3 6h14M5 12h10M7 18h6" strokeWidth="2" />
            </svg>
            Filters
          </button>
          <button
            type="submit"
            className="ml-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Find Job
          </button>
        </div>
        {/* Popular searches */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 pl-2">
          <span>Popular searches:</span>
          {[
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
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-blue-100 hover:text-blue-600 font-medium"
              onClick={() => {
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
        filters={filters}
        setFilters={setFilters}
        onApply={() => {
          setShowFilter(false);
          setPage(1);
          fetchJobs();
        }}
      />

      {/* Job Cards Grid */}
      <div>
        {loading ? (
          <div className="text-center w-full py-10 text-gray-400">Loading...</div>
        ) : (
          <div ref={gridRef} className={`grid ${gridCols} gap-6`}>
            {jobs.map((job, idx) => (
              <JobCard key={job._id || idx} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          className="p-2 rounded-full hover:bg-gray-200"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-500">
            <path d="M13 17l-5-5 5-5" strokeWidth="2" />
          </svg>
        </button>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`w-9 h-9 rounded-full ${
              n === page ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            } font-semibold hover:bg-blue-100`}
            onClick={() => handlePageChange(n)}
          >
            {n.toString().padStart(2, "0")}
          </button>
        ))}
        <button
          className="p-2 rounded-full hover:bg-gray-200"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pagination.totalPages}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-500">
            <path d="M7 7l5 5-5 5" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
