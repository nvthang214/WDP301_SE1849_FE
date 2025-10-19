import api from "../00-Axios";
import {
	getCandidateSocial,
	addCandidateSocial,
	updateCandidateSocial,
	deleteCandidateSocial,
} from "./urls";

const getSocial = async (userId) => await api.get(getCandidateSocial(userId));

const addSocial = async (userId, social) =>
	await api.post(addCandidateSocial(userId), { social });

const updateSocial = async (userId, payload) =>
	await api.put(updateCandidateSocial(userId), payload);

const removeSocial = async (userId, platform) =>
	await api.delete(deleteCandidateSocial(userId), { data: { platform } });

export const CandidateService = {
	getCandidateSocial: getSocial,
	addCandidateSocial: addSocial,
	updateCandidateSocial: updateSocial,
	deleteCandidateSocial: removeSocial,
};
