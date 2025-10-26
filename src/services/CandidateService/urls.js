
export const getCandidateSocial = (userId) => `/candidates/social/${userId}`;
export const addCandidateSocial = (userId) => `/candidates/social/${userId}`;
export const updateCandidateSocial = (userId) => `/candidates/social/${userId}`;
export const deleteCandidateSocial = (userId) => `/candidates/social/${userId}`;

export const getCandidateProfile = (candidateId) => `/candidates/profile/${candidateId}`;
export const addCandidateProfile = (candidateId) => `/candidates/profile/${candidateId}`;
export const updateCandidateProfile = (candidateId) => `/candidates/profile/${candidateId}`;

export const getCandidateAppliedJobs = (userId) => `/candidates/applied-jobs/${userId}`;
export const applyJob = (userId) => `/candidates/applied-jobs/${userId}`;

export const getInfoCandidate = (userId) => `/candidates/info/${userId}`;
export const updateInfoCandidate = (userId) => `/candidates/info/${userId}`;