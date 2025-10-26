import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  SlidersHorizontal,
  Check,
  Building2,
  Briefcase,
  DollarSign,
  Globe2,
  RotateCcw,
} from "lucide-react";

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
  const [salary, setSalary] = useState([filters.minSalary ?? 0, filters.maxSalary ?? 120000]);
  const [customSalary, setCustomSalary] = useState(false);

  const presetSalaryMatch = useMemo(
    () =>
      salaryRanges.some(
        (range) =>
          range.min === (filters.minSalary ?? 0) && range.max === (filters.maxSalary ?? 120000)
      ),
    [filters.minSalary, filters.maxSalary, salaryRanges]
  );

  useEffect(() => {
    setSalary([filters.minSalary ?? 0, filters.maxSalary ?? 120000]);
    setCustomSalary(Boolean(filters.minSalary || filters.maxSalary) && !presetSalaryMatch);
  }, [filters.minSalary, filters.maxSalary, presetSalaryMatch]);

  const handlePresetSalary = (range) => {
    setCustomSalary(false);
    setSalary([range.min, range.max]);
    setFilters((prev) => ({
      ...prev,
      minSalary: range.min,
      maxSalary: range.max,
    }));
  };

  const handleCustomSalary = (index, value) => {
    const next = [...salary];
    next[index] = value;
    setSalary(next);
    setFilters((prev) => ({
      ...prev,
      minSalary: index === 0 ? value : prev.minSalary,
      maxSalary: index === 1 ? value : prev.maxSalary,
    }));
  };

  const handleReset = () => {
    setCustomSalary(false);
    setSalary([0, 120000]);
    setFilters({
      jobType: "",
      experience: "",
      categoryId: "",
      minSalary: undefined,
      maxSalary: undefined,
      isActive: undefined,
      remote: undefined,
    });
  };

  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 bottom-0 left-0 flex w-full max-w-[360px] transform bg-white shadow-[var(--shadow-lg)] transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full flex-col">
          <header className="flex items-center justify-between border-b border-[var(--color-neutral-200)] px-6 py-5">
            <div className="flex items-center gap-3 text-[var(--color-neutral-900)]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-500)]">
                <SlidersHorizontal size={18} strokeWidth={1.6} />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Filter Jobs</h2>
                <p className="text-xs text-[var(--color-neutral-500)]">
                  Refine search results to find the perfect match.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)]"
            >
              <X size={18} strokeWidth={1.6} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <section className="mb-6 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-neutral-700)]">
                <Building2 size={16} strokeWidth={1.6} />
                Categories
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, categoryId: "" }))}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    !filters.categoryId
                      ? "bg-[var(--color-primary-500)] !text-white shadow-[var(--shadow-sm)]"
                      : "border border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const active = filters.categoryId === cat._id;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, categoryId: cat._id }))}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                        active
                          ? "bg-[var(--color-primary-500)] !text-white shadow-[var(--shadow-sm)]"
                          : "border border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-[var(--color-neutral-200)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-neutral-700)]">
                <Briefcase size={16} strokeWidth={1.6} />
                Job Type
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, jobType: "" }))}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    !filters.jobType
                      ? "border border-[var(--color-primary-300)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
                      : "border border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
                  }`}
                >
                  All
                </button>
                {jobTypes.map((type) => {
                  const active = filters.jobType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, jobType: type }))}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                        active
                          ? "border border-[var(--color-primary-300)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
                          : "border border-[var(--color-neutral-200)] bg-white text-[var(--color-neutral-600)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
                      }`}
                    >
                      {type.replace("-", " ")}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="mb-6 rounded-2xl border border-[var(--color-neutral-200)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-neutral-700)]">
                <DollarSign size={16} strokeWidth={1.6} />
                Salary (yearly)
              </div>
              <div className="flex flex-col gap-2">
                {salaryRanges.map((range) => {
                  const isActive =
                    !customSalary &&
                    filters.minSalary === range.min &&
                    filters.maxSalary === range.max;
                  return (
                    <button
                      key={range.label}
                      type="button"
                      onClick={() => handlePresetSalary(range)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                        isActive
                          ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)] shadow-[var(--shadow-sm)]"
                          : "border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
                      }`}
                    >
                      <span>{range.label}</span>
                      {isActive && <Check size={16} strokeWidth={1.6} />}
                    </button>
                  );
                })}

                <div
                  className={`rounded-xl border px-3 py-2 transition ${
                    customSalary
                      ? "border-[var(--color-primary-300)] bg-[var(--color-primary-50)]"
                      : "border-[var(--color-neutral-200)]"
                  }`}
                >
                  <label className="flex items-center justify-between text-sm font-medium text-[var(--color-neutral-600)]">
                    <span>Custom range</span>
                    <input
                      type="checkbox"
                      checked={customSalary}
                      onChange={(e) => setCustomSalary(e.target.checked)}
                      className="h-4 w-4 accent-[var(--color-primary-500)]"
                    />
                  </label>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <input
                      type="number"
                      min={0}
                      value={salary[0]}
                      disabled={!customSalary}
                      onChange={(e) => handleCustomSalary(0, Number(e.target.value))}
                      className="w-full rounded-lg border border-[var(--color-neutral-200)] px-3 py-2 text-[var(--color-neutral-700)] placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-primary-400)] focus:outline-none disabled:bg-[var(--color-neutral-100)]"
                      placeholder="Min"
                    />
                    <span className="text-[var(--color-neutral-400)]">—</span>
                    <input
                      type="number"
                      min={0}
                      value={salary[1]}
                      disabled={!customSalary}
                      onChange={(e) => handleCustomSalary(1, Number(e.target.value))}
                      className="w-full rounded-lg border border-[var(--color-neutral-200)] px-3 py-2 text-[var(--color-neutral-700)] placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-primary-400)] focus:outline-none disabled:bg-[var(--color-neutral-100)]"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-neutral-700)]">
                  <Globe2 size={16} strokeWidth={1.6} />
                  Remote Job
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={Boolean(filters.remote)}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        remote: e.target.checked ? true : undefined,
                      }))
                    }
                  />
                  <span className="h-6 w-11 rounded-full bg-[var(--color-neutral-200)] transition peer-checked:bg-[var(--color-primary-500)] peer-focus:outline peer-focus:outline-2 peer-focus:outline-[var(--color-primary-200)]" />
                  <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5 peer-checked:shadow-[var(--shadow-sm)]" />
                </label>
              </div>
              <p className="mt-2 text-xs text-[var(--color-neutral-500)]">
                Show positions that allow fully remote or hybrid working modes.
              </p>
            </section>
          </div>

          <footer className="flex items-center gap-3 border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-6 py-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-neutral-600)] transition hover:border-[var(--color-primary-200)] hover:text-[var(--color-primary-600)]"
            >
              <RotateCcw size={16} strokeWidth={1.6} />
              Reset
            </button>
            <button
              type="button"
              onClick={onApply}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-[var(--color-primary-500)] p-2 text-sm font-semibold !text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--color-primary-600)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] focus-visible:outline-none"
            >
              <Check size={16} strokeWidth={1.6} />
              Apply Filters
            </button>
          </footer>
        </div>
      </aside>
    </div>
  );
}

export default FilterSidebar;
