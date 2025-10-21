import React, { useEffect, useMemo, useState, useContext } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { Context } from "../../../../contexts";
import api from "../../../../services/00-Axios";

const statusOptions = [
  { label: "All Applications", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-[var(--color-warning-100)] text-[var(--color-warning-700)] border border-[var(--color-warning-200)]";
    case "reviewed":
      return "bg-[var(--color-info-100)] text-[var(--color-info-700)] border border-[var(--color-info-200)]";
    case "accepted":
      return "bg-[var(--color-success-100)] text-[var(--color-success-700)] border border-[var(--color-success-200)]";
    case "rejected":
      return "bg-[var(--color-danger-100)] text-[var(--color-danger-600)] border border-[var(--color-danger-200)]";
    default:
      return "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] border border-[var(--color-neutral-200)]";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [jobInfo, setJobInfo] = useState(null);
  const pageSize = 8;

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  // Get jobId from location state or URL params
  const jobId = location.state?.jobId || new URLSearchParams(location.search).get('jobId');
  const jobTitle = location.state?.jobTitle || 'Job Applications';
  
  // Debug logging
  console.log('=== Applications Page Debug ===');
  console.log('Full location object:', location);
  console.log('Location state:', location.state);
  console.log('Location search:', location.search);
  console.log('URL params jobId:', new URLSearchParams(location.search).get('jobId'));
  console.log('State jobId:', location.state?.jobId);
  console.log('Final JobId:', jobId);
  console.log('JobTitle:', jobTitle);
  console.log('=== End Debug ===');

  // Fetch applications for specific job or all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        let response;
        let transformedApplications = [];
        
        if (jobId) {
          // Fetch applications for the specific job
          response = await api.get(`/applications/jobs/${jobId}/candidates`);
          
          if (response.data.success) {
            const applicationsData = response.data.data || [];
            
            // Transform data to match frontend structure
            transformedApplications = applicationsData.map(app => ({
              _id: app._id,
              candidate: {
                _id: app.candidate._id,
                name: app.candidate.fullName || app.candidate.firstName + ' ' + app.candidate.lastName,
                email: app.candidate.email,
                phone: app.candidate.phone || "N/A",
                location: app.candidate.location || "N/A"
              },
              job: {
                _id: app.job,
                title: jobTitle,
                company: "Company Name"
              },
              status: app.status || "pending",
              appliedAt: app.createdAt || app.appliedDate,
              resume: app.resume || null
            }));
          }
        } else {
          // Fetch current user info first to get userId
          const userResponse = await api.get('/users/me');
          
          if (userResponse.data?.success && userResponse.data?.data) {
            const userId = userResponse.data.data._id;
            console.log("UserId from API:", userId);
            
            // Fetch all applications for the recruiter
            // First get all jobs by recruiter
            const jobsResponse = await api.get(`/jobs/recruiter/${userId}`);
            
            if (jobsResponse.data.success) {
              const jobs = jobsResponse.data.data || [];
              
              // Fetch applications for all jobs
              const allApplicationsPromises = jobs.map(async (job) => {
                try {
                  const appResponse = await api.get(`/applications/jobs/${job._id}/candidates`);
                  if (appResponse.data.success) {
                    return (appResponse.data.data || []).map(app => ({
                      _id: app._id,
                      candidate: {
                        _id: app.candidate._id,
                        name: app.candidate.fullName || app.candidate.firstName + ' ' + app.candidate.lastName,
                        email: app.candidate.email,
                        phone: app.candidate.phone || "N/A",
                        location: app.candidate.location || "N/A"
                      },
                      job: {
                        _id: job._id,
                        title: job.title,
                        company: "Company Name"
                      },
                      status: app.status || "pending",
                      appliedAt: app.createdAt || app.appliedDate,
                      resume: app.resume || null
                    }));
                  }
                  return [];
                } catch (error) {
                  console.log(`No applications found for job ${job._id}`);
                  return [];
                }
              });
              
              const allApplicationsArrays = await Promise.all(allApplicationsPromises);
              transformedApplications = allApplicationsArrays.flat();
            }
          }
        }
        
        setApplications(transformedApplications);
        
      } catch (error) {
        console.error("Failed to load applications:", error);
        message.error("Failed to load applications");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [jobId, jobTitle, navigate]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      if (statusFilter === "all") return true;
      return application?.status?.toLowerCase() === statusFilter;
    });
  }, [applications, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));
  const paginatedApplications = filteredApplications.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setStatusDropdownOpen(false);
    setPage(1);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      // Call API to update application status
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        message.success(`Application status updated to ${newStatus}`);
      } else {
        message.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
      message.error("Failed to update application status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[var(--shadow-md)] md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)] hover:bg-[var(--color-neutral-100)] rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
            {jobId ? `Applications for "${jobTitle}"` : "All Applications"}{" "}
            <span className="text-sm font-medium text-[var(--color-neutral-500)]">
              ({applications.length})
            </span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
            {jobId ? "Review and manage candidate applications for this job posting." : "Review and manage all candidate applications across all job postings."}
          </p>
        </div>
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-neutral-700)] shadow-sm transition hover:border-[var(--color-primary-300)]"
            onClick={() => setStatusDropdownOpen((prev) => !prev)}
          >
            Application status
            <span className="rounded-lg bg-[var(--color-primary-50)] px-2 py-1 text-xs font-semibold text-[var(--color-primary-600)]">
              {statusOptions.find((option) => option.value === statusFilter)?.label}
            </span>
            <ChevronDown size={16} strokeWidth={1.6} />
          </button>
          {statusDropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-lg)]">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm transition ${
                    statusFilter === option.value
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-600)]"
                      : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]"
                  }`}
                >
                  {option.label}
                  {statusFilter === option.value && (
                    <span className="text-xs font-semibold text-[var(--color-primary-500)]">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)]">
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.7fr_auto] items-center gap-4 border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-6 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-neutral-500)]">
          <span>Candidate</span>
          <span>Job Position</span>
          <span>Applied Date</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-[var(--color-neutral-500)]">
            Loading applications...
          </div>
        ) : paginatedApplications.length === 0 ? (
          <div className="px-6 py-16 text-center text-[var(--color-neutral-500)]">
            No applications found for current filter.
          </div>
        ) : (
          paginatedApplications.map((application) => (
            <div
              key={application?._id}
              className="group grid grid-cols-[1.5fr_1fr_0.8fr_0.7fr_auto] items-center gap-4 border-b border-[var(--color-neutral-100)] px-6 py-5 last:border-none hover:bg-[var(--color-primary-50)]/50"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-100)]">
                    <User size={20} className="text-[var(--color-primary-600)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[var(--color-neutral-900)]">
                      {application?.candidate?.name || "Unknown Candidate"}
                    </h3>
                    <div className="mt-1 flex flex-col gap-1 text-xs text-[var(--color-neutral-500)]">
                      <div className="flex items-center gap-1">
                        <Mail size={12} />
                        <span>{application?.candidate?.email || "N/A"}</span>
                      </div>
                      {application?.candidate?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{application.candidate.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-[var(--color-neutral-900)]">
                  {application?.job?.title || "Unknown Position"}
                </h4>
                <p className="text-sm text-[var(--color-neutral-500)]">
                  {application?.job?.company || "Unknown Company"}
                </p>
              </div>

              <div className="text-sm text-[var(--color-neutral-700)]">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(application?.appliedAt)}</span>
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    application?.status
                  )}`}
                >
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {application?.status?.charAt(0).toUpperCase() + application?.status?.slice(1) || "Unknown"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={application?.status || "pending"}
                  onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                  className="rounded-lg border border-[var(--color-neutral-200)] px-2 py-1 text-xs font-medium text-[var(--color-neutral-700)] transition hover:border-[var(--color-primary-300)]"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                {application?.resume && (
                  <button
                    type="button"
                    className="rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] px-3 py-1 text-xs font-medium text-[var(--color-primary-600)] transition hover:bg-[var(--color-primary-100)]"
                    onClick={() => {
                      // Open resume in new tab or download
                      if (application.resume.startsWith('http')) {
                        window.open(application.resume, '_blank');
                      } else {
                        // If it's a filename, you might need to construct the full URL
                        message.info("Resume file: " + application.resume);
                      }
                    }}
                  >
                    View Resume
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-[var(--shadow-md)]">
          <p className="text-sm text-[var(--color-neutral-500)]">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredApplications.length)} of{" "}
            {filteredApplications.length} applications
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-neutral-200)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition hover:border-[var(--color-primary-300)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-[var(--color-neutral-700)]">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-neutral-200)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-neutral-700)] transition hover:border-[var(--color-primary-300)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}