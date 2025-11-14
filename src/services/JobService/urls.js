//job
export const getAll = (flag) => `/jobs/list/${flag}`;
export const getById = (flag, id) => `/jobs/details/${id}/${flag}`;
export const postJob = "/jobs/post";
export const updateJob = (id) => `/jobs/edit/${id}`;
export const activateJob = (id) => `/jobs/activate/${id}`;
export const getCompanyOfRecruiter = () => `/companies/recruiter/my-company`;
export const getJobsOfRecruiter = () => `/jobs/recruiter/my-jobs`;
export const toggleFavorite = (jobId) => `/jobs/favorite/${jobId}`;
export const getNumberOfApplicationsByJobId = (jobId) => `jobs/applications/count/${jobId}`;
export const getApplicationsByJobId = (jobId) => `jobs/applications/${jobId}`;
export const toggleJobStatus = (id) => `/jobs/status/${id}`;