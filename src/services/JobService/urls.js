//job
export const getAll = "/jobs/list";
export const getById = (id) => `/jobs/${id}`;
export const postJob = "/jobs/post";
export const updateJob = (id) => `/jobs/edit/${id}`;
export const deactivateJob = (id) => `/jobs/deactivate/${id}`;
export const activateJob = (id) => `/jobs/activate/${id}`;
export const getCompanyOfRecruiter = () => `/companies/recruiter/my-company`;
export const getJobsOfRecruiter = () => `/jobs/recruiter/my-jobs`;