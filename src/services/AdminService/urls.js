export const adminUrls = {
  // User management
  getAllUsers: "/admin/users",
  getUserById: (userId) => `/admin/users/${userId}`,
  banUser: (userId) => `/admin/users/${userId}/ban`,
  updateUserRole: (userId) => `/admin/users/${userId}/role`,
  
  // Role management
  getAllRoles: "/admin/roles",
  
  // Job management
  getAllJobs: "/admin/jobs",
  toggleJobVisibility: (jobId) => `/admin/jobs/${jobId}/toggle`,
  deleteJob: (jobId) => `/admin/jobs/${jobId}`,
};
