import React, { useState } from "react";
import {
  X,
  SlidersHorizontal,
  Check,
  Building2,
  Users,
  MapPin,
  RotateCcw,
} from "lucide-react";

function FilterSidebar({
  open,
  onClose,
  filters,
  setFilters,
  onApply,
  companyTypes,
  companySizes,
}) {
  const handleReset = () => {
    setFilters({
      companyType: "",
      companySize: "",
      location: "",
      hasOpenings: undefined,
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
        className={`fixed left-0 top-0 bottom-0 flex w-full max-w-[360px] transform bg-white shadow-[var(--shadow-lg)] transition-transform duration-300 ${
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
                <h2 className="text-lg font-semibold">Filter Companies</h2>
                <p className="text-xs text-[var(--color-neutral-500)]">
                  Refine search results to find the perfect company.
                </p>
              </div>
            </div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-neutral-400)] transition hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-600)]"
              onClick={onClose}
            >
              <X size={18} strokeWidth={1.6} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              {/* Company Type Filter */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-[var(--color-neutral-900)]">
                  <Building2 size={18} strokeWidth={1.6} />
                  <h3 className="font-semibold">Company Type</h3>
                </div>
                <div className="space-y-3">
                  {companyTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-neutral-700)]"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="companyType"
                          value={type.value}
                          checked={filters.companyType === type.value}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              companyType: e.target.value,
                            }))
                          }
                          className="peer sr-only"
                        />
                        <div className="h-4 w-4 rounded-full border-2 border-[var(--color-neutral-300)] transition peer-checked:border-[var(--color-primary-500)] peer-checked:bg-[var(--color-primary-500)]" />
                        <Check
                          size={10}
                          strokeWidth={2.5}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition peer-checked:opacity-100"
                        />
                      </div>
                      <span className="flex-1">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Company Size Filter */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-[var(--color-neutral-900)]">
                  <Users size={18} strokeWidth={1.6} />
                  <h3 className="font-semibold">Company Size</h3>
                </div>
                <div className="space-y-3">
                  {companySizes.map((size) => (
                    <label
                      key={size.value}
                      className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-neutral-700)]"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name="companySize"
                          value={size.value}
                          checked={filters.companySize === size.value}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              companySize: e.target.value,
                            }))
                          }
                          className="peer sr-only"
                        />
                        <div className="h-4 w-4 rounded-full border-2 border-[var(--color-neutral-300)] transition peer-checked:border-[var(--color-primary-500)] peer-checked:bg-[var(--color-primary-500)]" />
                        <Check
                          size={10}
                          strokeWidth={2.5}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition peer-checked:opacity-100"
                        />
                      </div>
                      <span className="flex-1">{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <div className="mb-4 flex items-center gap-2 text-[var(--color-neutral-900)]">
                  <MapPin size={18} strokeWidth={1.6} />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--color-neutral-300)] px-3 py-2 text-sm focus:border-[var(--color-primary-500)] focus:outline-none"
                />
              </div>

              {/* Has Openings Filter */}
              <div>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-[var(--color-neutral-700)]">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.hasOpenings === true}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasOpenings: e.target.checked ? true : undefined,
                        }))
                      }
                      className="peer sr-only"
                    />
                    <div className="h-4 w-4 rounded border-2 border-[var(--color-neutral-300)] transition peer-checked:border-[var(--color-primary-500)] peer-checked:bg-[var(--color-primary-500)]" />
                    <Check
                      size={10}
                      strokeWidth={2.5}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition peer-checked:opacity-100"
                    />
                  </div>
                  <span className="flex-1">Companies with open positions</span>
                </label>
              </div>
            </div>
          </div>

          <footer className="border-t border-[var(--color-neutral-200)] px-6 py-4">
            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-neutral-300)] px-4 py-2.5 text-sm font-medium text-[var(--color-neutral-700)] transition hover:bg-[var(--color-neutral-50)]"
                onClick={handleReset}
              >
                <RotateCcw size={16} strokeWidth={1.6} />
                Reset
              </button>
              <button
                className="flex flex-1 items-center justify-center rounded-lg bg-[var(--color-primary-500)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-600)]"
                onClick={onApply}
              >
                Apply Filters
              </button>
            </div>
          </footer>
        </div>
      </aside>
    </div>
  );
}

export default FilterSidebar;