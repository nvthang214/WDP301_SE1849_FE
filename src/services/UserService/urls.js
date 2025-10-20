export const getAll = "/users";
export const getUserProfile = (userId) => `/users/profile/${userId}`;
export const updateUserProfile = (userId) => `/users/profile/${userId}`;
export const getUserById = (userId) => `/users/${userId}`;
export const changePassword = "/auth/change-password";