import api from "../00-Axios";
import {
	getCandidateSocial,
	addCandidateSocial,
	updateCandidateSocial,
	deleteCandidateSocial,
	getCandidateProfile,
	addCandidateProfile,
	updateCandidateProfile,
	getCandidateAppliedJobs
} from "./urls";

export const CandidateService = {
	getCandidateSocial: async (userId) => await api.get(getCandidateSocial(userId)),
	addCandidateSocial: async (userId, social) => await api.post(addCandidateSocial(userId), { social }),
	updateCandidateSocial: async (userId, data) => await api.put(updateCandidateSocial(userId), data),
	deleteCandidateSocial: async (userId, platform) =>await api.delete(deleteCandidateSocial(userId), { data: { platform } }),

	getCandidateProfile: async (userId) => await api.get(getCandidateProfile(userId)),
	addCandidateProfile: async (userId, data) => await api.post(addCandidateProfile(userId), data),
	updateCandidateProfile: async (userId, data) => await api.put(updateCandidateProfile(userId), data),

	getCandidateAppliedJobs: async (userId) => await api.get(getCandidateAppliedJobs(userId)),
};
