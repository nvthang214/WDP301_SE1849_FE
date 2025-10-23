export const upgradeRequestUrls = {
  // Candidate URLs
  create: "/upgrade-requests",
  getMyRequest: "/upgrade-requests/my-request",
  
  // Admin URLs
  getAll: "/admin/upgrade-requests",
  getById: (requestId) => `/admin/upgrade-requests/${requestId}`,
  review: (requestId) => `/admin/upgrade-requests/${requestId}/review`,
  getStats: "/admin/upgrade-requests-stats",
};
