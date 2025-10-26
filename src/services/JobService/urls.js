//job
export const getAll = (flag) => `/jobs/list/${flag}`;
export const getById = (id) => `/jobs/details/${id}`;
export const postJob = "/jobs/post";
export const updateJob = (id) => `/jobs/edit/${id}`;
export const deactivateJob = (id) => `/jobs/deactivate/${id}`;
export const activateJob = (id) => `/jobs/activate/${id}`;
export const getCompanyOfRecruiter = () => `/companies/recruiter/my-company`;
export const getJobsOfRecruiter = () => `/jobs/recruiter/my-jobs`;
export const toggleFavorite = (jobId) => `/jobs/favorite/${jobId}`;
