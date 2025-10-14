import React, { useState, useEffect } from "react";

// Sidebar Filter Component
function FilterSidebar({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  categories,
  jobTypes,
  salaryRanges,
}) {
  const [salary, setSalary] = useState([
    filters.salary_min || 0,
    filters.salary_max || 120000,
  ]);
  const [customSalary, setCustomSalary] = useState(false);

  useEffect(() => {
    setSalary([filters.salary_min || 0, filters.salary_max || 120000]);
  }, [filters.salary_min, filters.salary_max]);

  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ${
          open ? "opacity-30" : "opacity-0"
        }`}
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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
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
                  key={cat._id}
                  className={`py-1 px-2 rounded cursor-pointer ${
                    filters.categoryId === cat._id
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setFilters((f) => ({ ...f, categoryId: cat._id }))
                  }
                >
                  {cat.name}
                </li>
              ))}
              <li
                className={`py-1 px-2 rounded cursor-pointer ${
                  !filters.categoryId ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"
                }`}
                onClick={() => setFilters((f) => ({ ...f, categoryId: "" }))}
              >
                All
              </li>
            </ul>
          </div>
          {/* Job Type */}
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">Job Type</div>
            {jobTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name="jobType"
                  checked={filters.jobType === type}
                  onChange={() => setFilters((f) => ({ ...f, jobType: type }))}
                />
                <span>{type.replace("-", " ")}</span>
              </label>
            ))}
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="radio"
                name="jobType"
                checked={!filters.jobType}
                onChange={() => setFilters((f) => ({ ...f, jobType: "" }))}
              />
              <span>All</span>
            </label>
          </div>
          {/* Salary */}
          <div className="mb-4">
            <div className="font-semibold mb-2 text-gray-700">
              Salary (yearly)
            </div>
            <div className="flex flex-col gap-1">
              {salaryRanges.map((range, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="salary"
                    checked={
                      !customSalary &&
                      filters.minSalary === range.min &&
                      filters.maxSalary === range.max
                    }
                    onChange={() => {
                      setCustomSalary(false);
                      setFilters((f) => ({
                        ...f,
                        minSalary: range.min,
                        maxSalary: range.max,
                      }));
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
                      setFilters((f) => ({
                        ...f,
                        salary_min: +e.target.value,
                      }));
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
                      setFilters((f) => ({
                        ...f,
                        salary_max: +e.target.value,
                      }));
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
                onChange={(e) =>
                  setFilters((f) => ({ ...f, remote: e.target.checked }))
                }
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

export default FilterSidebar;
