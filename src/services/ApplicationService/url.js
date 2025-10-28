export const getAll = "/applications";
export const getById = (id) => `/applications/${id}`;
export const updateApplicationStatus = (id) => `/applications/${id}/status`;
export const getApplicationsByJobId = (jobId) => `/applications/jobs/${jobId}/candidates`;
export const filterApplicationsByStatus = (jobId) => `/applications/jobs/${jobId}/candidates/filter`;
export const getAllApplicationsByRecruiter = "/applications";
export const getShortlistedApplicationsByRecruiter = "/applications/shortlisted";
