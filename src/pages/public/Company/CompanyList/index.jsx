import React, { useState, useEffect } from "react";
import CompanyService from "../../../../services/CompanyService";
import { useResponsive } from "../../../../hook/useResponsive";
import CompanyCard from "../../../../components/Card/CompanyCard";
import FilterSidebar from "./components/FilterSidebar";

// Company types for filtering
const companyTypes = [
  { label: "All Types", value: "" },
  { label: "Startup", value: "startup" },
  { label: "Corporation", value: "corporation" },
  { label: "Non-profit", value: "non-profit" },
  { label: "Government", value: "government" },
];

// Company sizes for filtering
const companySizes = [
  { label: "All Sizes", value: "" },
  { label: "1-10 employees", value: "1-10" },
  { label: "11-50 employees", value: "11-50" },
  { label: "51-200 employees", value: "51-200" },
  { label: "201-1000 employees", value: "201-1000" },
  { label: "1000+ employees", value: "1000+" },
];

// Initial filters
const initialFilters = {
  companyType: "",
  companySize: "",
  location: "",
  hasOpenings: undefined,
};

export default function CompanyList() {
  const { isMobile, isTablet } = useResponsive();
  const gridCols = isMobile
    ? "grid-cols-1"
    : isTablet
    ? "grid-cols-2"
    : "grid-cols-3"; 

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        ...(search && { search }),
        ...(filters.companyType && { companyType: filters.companyType }),
        ...(filters.companySize && { companySize: filters.companySize }),
        ...(filters.location && { location: filters.location }),
        ...(filters.hasOpenings !== undefined && { hasOpenings: filters.hasOpenings }),
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const res = filters.location
        ? await CompanyService.getCompaniesByLocation(params)
        : await CompanyService.getCompanies(params);

      setCompanies(res.data.companies || []);
      setPagination(
        res.data.pagination || {
          total: 0,
          page: 1,
          limit: 15,
          totalPages: res.data.totalPages || 1,
        }
      );
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
      setPagination({ total: 0, page: 1, limit: 15, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search, filters, page, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    setFilters((prev) => ({
      ...prev,
      location: locationSearch.trim() || "",
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-10">
      <div className="w-full">
        <form className="mb-8 flex w-full flex-col gap-2" onSubmit={handleSearch}>
          <div className="w-full flex flex-wrap items-center gap-3 rounded-xl border bg-white px-5 py-3 shadow-sm">
            <div className="flex flex-1 items-center gap-2 min-w-[200px]">
              <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-400">
                <circle cx="9" cy="9" r="7" strokeWidth="2" />
                <path d="M16 16L13.5 13.5" strokeWidth="2" />
              </svg>
              <input
                className="flex-1 bg-transparent text-base outline-none"
                placeholder="Search by: Company name, Industry, Location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="flex items-center bg-gray-50 rounded px-3 py-2 min-w-[220px] md:min-w-[280px]">
              <svg width="16" height="16" fill="none" stroke="currentColor" className="text-gray-400 mr-2">
                <path d="M12 2l3 3-3 3M3 14l3-3-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" strokeWidth="2"/>
              </svg>
              <input
                className="flex-1 outline-none bg-transparent text-sm"
                placeholder="City, state or zip code"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 hover:bg-gray-200"
                onClick={() => setShowFilter(true)}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" className="text-gray-600">
                  <path d="M3 6h14M5 12h10M7 18h6" strokeWidth="2" />
                </svg>
                Filters
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary-500)] px-5 py-2 font-semibold text-white shadow-md transition hover:bg-[var(--color-primary-600)]"
              >
                Find Company
              </button>
            </div>
          </div>
        </form>

     
        {loading ? (
          <div className="text-center w-full py-10 text-gray-400">Loading...</div>
        ) : companies.length === 0 ? (
          <div className="text-center w-full py-20">
            <div className="text-gray-400 text-lg mb-2">
              <svg className="mx-auto mb-4 w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có công ty nào</h3>
            <p className="text-gray-500">Không tìm thấy công ty nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          </div>
        ) : (
         
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-6`}>
            {companies.map((company, idx) => (
              <CompanyCard
                key={company._id || idx}
                companyId={company._id}
                name={company.name}
                location={company.address}
                openings={company.openPositions || 0}
                logo={company.logo}
                companyType={company.companyType || "Technology"}
              />
            ))}
          </div>
        )}

        
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-30"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor">
              <path d="M11 15L7 11L11 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                n === page
                  ? "bg-[var(--color-primary-500)] text-white shadow-md"
                  : "bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600"
              }`}
              onClick={() => handlePageChange(n)}
            >
              {n.toString().padStart(2, "0")}
            </button>
          ))}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-30"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.totalPages}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor">
              <path d="M7 7L11 11L7 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <FilterSidebar
          open={showFilter}
          onClose={() => setShowFilter(false)}
          filters={draftFilters}
          setFilters={setDraftFilters}
          onApply={() => {
            setFilters(draftFilters);
            setPage(1);
            setShowFilter(false);
          }}
          companyTypes={companyTypes}
          companySizes={companySizes}
        />
      </div>
    </div>
  );
}
