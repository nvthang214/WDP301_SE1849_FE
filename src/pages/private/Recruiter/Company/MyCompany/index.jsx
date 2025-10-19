import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import { CompanyService } from "../../../../../services/CompanyService";

export default function MyCompany() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    try {
      setLoading(true);

      // Get user data from localStorage
      const user = localStorage.getItem("user");
      let recruiterId = null;

      if (user) {
        try {
          const userData = JSON.parse(user);
          recruiterId = userData?._id || userData?.id;

          // If no id in user data, try to get from token
          if (!recruiterId) {
            const token = localStorage.getItem("accessToken");
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                recruiterId = payload.userId;
              } catch (e) {
                console.error("Error decoding token:", e);
              }
            }
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      if (recruiterId) {
        try {
          const res = await CompanyService.getCompanyByRecruiter(recruiterId);
          
          // Handle API response
          let companyData = null;
          
          if (res?.data && (res.data.name || res.data._id)) {
            companyData = res.data;
          } else if (res && (res.name || res._id)) {
            companyData = res;
          } else if (res?.companies && Array.isArray(res.companies)) {
            companyData = res.companies[0] || null;
          } else if (res?.company) {
            companyData = res.company;
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
  };

  useEffect(() => {
    fetchCompany();
  }, []);

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
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)]">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
              My Company
            </h1>
            <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
              Manage your company information and settings.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-12 text-center">
          <Building2 className="mx-auto h-16 w-16 text-[var(--color-neutral-300)] mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-2">
            No Company Found
          </h3>
          <p className="text-[var(--color-neutral-500)] mb-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)] md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
            My Company
            <span className="text-sm font-medium text-[var(--color-neutral-500)] ml-2">
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
        <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-md)]">
          <img 
            src={company.banner} 
            alt="Company banner" 
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Information */}
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <div className="flex items-center gap-4 mb-4">
            {company?.logo ? (
              <img 
                src={company.logo} 
                alt="Company logo" 
                className="w-16 h-16 object-cover rounded-lg border border-[var(--color-neutral-200)]"
              />
            ) : (
              <div className="w-16 h-16 bg-[var(--color-neutral-100)] rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[var(--color-neutral-400)]" />
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
              <label className="text-sm font-medium text-[var(--color-neutral-500)]">Industry</label>
              <p className="text-[var(--color-neutral-900)]">{company?.industry || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-neutral-500)]">Address</label>
              <p className="text-[var(--color-neutral-900)]">{company?.address || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-neutral-500)]">Team Size</label>
              <p className="text-[var(--color-neutral-900)]">{company?.teamSize || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-neutral-500)]">Email</label>
              <p className="text-[var(--color-neutral-900)]">{company?.contact?.email || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-neutral-500)]">Phone</label>
              <p className="text-[var(--color-neutral-900)]">{company?.contact?.phone || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-neutral-500)]">Website</label>
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
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            About Company
          </h2>
          <p className="text-[var(--color-neutral-700)] leading-relaxed">
            {company.description}
          </p>
        </div>
      )}

      {/* Social Media */}
      {(company?.social?.facebook || company?.social?.linkedin || company?.social?.twitter || company?.social?.youtube) && (
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
            Social Media
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {company.social.facebook && (
              <div>
                <label className="text-sm font-medium text-[var(--color-neutral-500)]">Facebook</label>
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
                <label className="text-sm font-medium text-[var(--color-neutral-500)]">LinkedIn</label>
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
                <label className="text-sm font-medium text-[var(--color-neutral-500)]">Twitter</label>
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
                <label className="text-sm font-medium text-[var(--color-neutral-500)]">YouTube</label>
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
          <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
              Benefits
            </h2>
            <p className="text-[var(--color-neutral-700)] leading-relaxed">
              {company.benefits}
            </p>
          </div>
        )}

        {company?.vision && (
          <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
              Vision
            </h2>
            <p className="text-[var(--color-neutral-700)] leading-relaxed">
              {company.vision}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
