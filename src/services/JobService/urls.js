//job
export const getAll = "/jobs";
export const getById = (id) => `/jobs/${id}`;
export const postJob = "/jobs/post";
export const updateJob = (id) => `/jobs/edit/${id}`;
export const deactivateJob = (id) => `/jobs/deactivate/${id}`;
export const activateJob = (id) => `/jobs/activate/${id}`;
export const getCompanyByRecruiterId = (recruiterId) => `/companies/recruiter/${recruiterId}`;
export const getJobsByRecruiterId = (recruiterId) => `/jobs/recruiter/${recruiterId}`;
