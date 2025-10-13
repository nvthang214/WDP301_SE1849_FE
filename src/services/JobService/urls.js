
export const getAll = "/jobs";
export const getById = (id) => `/jobs/${id}`;
export const postJob = "/jobs/post";
export const updateJob = (id) => `/jobs/edit/${id}`;
export const deactivateJob = (id) => `/jobs/deactivate/${id}`;