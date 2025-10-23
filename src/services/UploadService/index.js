import api from "../00-Axios";
import {
    getCandidateCv,
    addCandidateCv,
    updateCandidateCv,
    deleteCandidateCv,
    getUserAvatar,
    addUserAvatar,
    updateUserAvatar,
    deleteUserAvatar,
} from "./urls.js";

const multipartConfig = {
    headers: { "Content-Type": "multipart/form-data" },
};


export const UploadService = {
    getCandidateCv: async (userId) => await api.get(getCandidateCv(userId)),
    addCandidateCv: async (userId, cvData) => await api.post(addCandidateCv(userId), cvData, multipartConfig),
    updateCandidateCv: async (userId, cvData) => await api.put(updateCandidateCv(userId), cvData, multipartConfig),
    deleteCandidateCv: async (userId) => await api.delete(deleteCandidateCv(userId)),

    getUserAvatar: async (userId) => await api.get(getUserAvatar(userId)),
    addUserAvatar: async (userId, avatarData) => await api.post(addUserAvatar(userId), avatarData, multipartConfig),
    updateUserAvatar: async (userId, avatarData) => await api.put(updateUserAvatar(userId), avatarData, multipartConfig),
    deleteUserAvatar: async (userId) => await api.delete(deleteUserAvatar(userId)),
};