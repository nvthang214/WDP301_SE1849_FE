import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import { CompanyService } from "../../../../../services/CompanyService";
import useAuthStore from "../../../../../store/useAuthStore";

const decodeAccessToken = (token) => {
  if (!token) return null;
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode access token", error);
    return null;
  }
};

export default function MyCompany() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recruiterId, setRecruiterId] = useState(null);

  const { user: authUser, accessToken } = useAuthStore();

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);

      const recruiterIdFromUser = authUser?._id || authUser?.id || null;
      let recruiterId = recruiterIdFromUser;

      if (!recruiterId) {
        const payload = decodeAccessToken(accessToken);
        recruiterId = payload?.userId || null;
      }

      setRecruiterId(recruiterId);

      if (recruiterId) {
        try {
          const res = await CompanyService.getCompanyByRecruiter(recruiterId);

          // Handle API response
          let companyData = null;

          if (res?.data && (res.data.name || res.data._id)) {
            companyData = res.data;
          } else if (res?.companies) {
            companyData = res.companies;
          } else if (res && (res.name || res._id)) {
            companyData = res;
          }

          if (companyData && (companyData.name || companyData._id)) {
            setCompany(companyData);
          } else {
            setCompany(null);
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          setCompany(null);
        }
      } else {
        setCompany(null);
      }
    } catch (error) {
      console.error("Error in fetchCompany:", error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [authUser, accessToken]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleDeleteCompany = async () => {
    if (!company?._id) return;

    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await CompanyService.deleteCompany(company._id);
        setCompany(null);
        alert("Company deleted successfully!");
      } catch (error) {
        console.error("Failed to delete company:", error);
        alert("Failed to delete company. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)]">
          <div className="animate-pulse">
            <div className="mb-2 h-8 w-1/3 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
          <div className="animate-pulse">
            <div className="h-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)]">
          <div className="animate-pulse">
            <div className="mb-2 h-8 w-1/3 rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
          <div className="animate-pulse">
            <div className="h-32 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!company ? (
        <>
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)]">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">My Company</h1>
              <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
                Manage your company information and settings.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-12 text-center shadow-[var(--shadow-md)]">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-[var(--color-neutral-300)]" />
            <h3 className="mb-2 text-lg font-semibold text-[var(--color-neutral-900)]">
              No Company Found
            </h3>
            <p className="mb-6 text-[var(--color-neutral-500)]">
              You haven't created a company yet. Create one to start posting jobs.
            </p>

            <Link
              to="/recruiter/company/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-600)]"
            >
              <Plus size={20} />
              Create Company
            </Link>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)] md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
                My Company
                <span className="ml-2 text-sm font-medium text-[var(--color-neutral-500)]">
                  ({company?.name || "Unnamed"})
                </span>
              </h1>
              <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
                Manage your company information and settings.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/recruiter/company/edit/${company._id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-600)] transition hover:bg-[var(--color-primary-100)]"
              >
                <Edit size={16} />
                Edit Company
              </Link>
              <button
                onClick={handleDeleteCompany}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                Delete Company
              </button>
            </div>
          </div>

          {/* Company Banner */}
          {company?.banner && (
            <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-md)]">
              <img src={company.banner} alt="Company banner" className="h-48 w-full object-cover" />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Information */}
            <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
              <div className="mb-4 flex items-center gap-4">
                {company?.logo ? (
                  <img
                    src={company.logo}
                    alt="Company logo"
                    className="h-16 w-16 rounded-lg border border-[var(--color-neutral-200)] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--color-neutral-100)]">
                    <Building2 className="h-8 w-8 text-[var(--color-neutral-400)]" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                    Company Information
                  </h2>
                  <p className="text-sm text-[var(--color-neutral-500)]">
                    {company?.name || "Unnamed Company"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                    Industry
                  </label>
                  <p className="text-[var(--color-neutral-900)]">
                    {company?.industry || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                    Address
                  </label>
                  <p className="text-[var(--color-neutral-900)]">
                    {company?.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                    Team Size
                  </label>
                  <p className="text-[var(--color-neutral-900)]">
                    {company?.teamSize || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
              <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                    Email
                  </label>
                  <p className="text-[var(--color-neutral-900)]">
                    {company?.contact?.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                    Phone
                  </label>
                  <p className="text-[var(--color-neutral-900)]">
                    {company?.contact?.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                    Website
                  </label>
                  <p className="text-[var(--color-neutral-900)]">
                    {company?.contact?.website ? (
                      <a
                        href={company.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary-600)] hover:underline"
                      >
                        {company.contact.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Description */}
          {company?.description && (
            <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
              <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
                About Company
              </h2>
              <p className="leading-relaxed text-[var(--color-neutral-700)]">
                {company.description}
              </p>
            </div>
          )}

          {/* Social Media */}
          {(company?.social?.facebook ||
            company?.social?.linkedin ||
            company?.social?.twitter ||
            company?.social?.youtube) && (
            <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
              <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
                Social Media
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {company.social.facebook && (
                  <div>
                    <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                      Facebook
                    </label>
                    <p className="text-[var(--color-neutral-900)]">
                      <a
                        href={company.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary-600)] hover:underline"
                      >
                        {company.social.facebook}
                      </a>
                    </p>
                  </div>
                )}
                {company.social.linkedin && (
                  <div>
                    <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                      LinkedIn
                    </label>
                    <p className="text-[var(--color-neutral-900)]">
                      <a
                        href={company.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary-600)] hover:underline"
                      >
                        {company.social.linkedin}
                      </a>
                    </p>
                  </div>
                )}
                {company.social.twitter && (
                  <div>
                    <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                      Twitter
                    </label>
                    <p className="text-[var(--color-neutral-900)]">
                      <a
                        href={company.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary-600)] hover:underline"
                      >
                        {company.social.twitter}
                      </a>
                    </p>
                  </div>
                )}
                {company.social.youtube && (
                  <div>
                    <label className="text-sm font-medium text-[var(--color-neutral-500)]">
                      YouTube
                    </label>
                    <p className="text-[var(--color-neutral-900)]">
                      <a
                        href={company.social.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary-600)] hover:underline"
                      >
                        {company.social.youtube}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits & Vision */}
          <div className="grid gap-6 md:grid-cols-2">
            {company?.benefits && (
              <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
                <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
                  Benefits
                </h2>
                <p className="leading-relaxed text-[var(--color-neutral-700)]">
                  {company.benefits}
                </p>
              </div>
            )}

            {company?.vision && (
              <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-md)]">
                <h2 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
                  Vision
                </h2>
                <p className="leading-relaxed text-[var(--color-neutral-700)]">{company.vision}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
