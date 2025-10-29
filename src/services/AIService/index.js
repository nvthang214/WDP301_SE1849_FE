import api from "../00-Axios";
import { aiUrl } from "./urls";

// User Management Services
const candidateQueryAI = async (payload) => {
  return await api.post(aiUrl.candidateQueryAI, payload);
};

export const AIService = {
  candidateQueryAI,
};
