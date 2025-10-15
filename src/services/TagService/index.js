import api from "../00-Axios";
import { getAllTags } from "./urls";

export const TagService = {
  getAllTags: async () => await api.get(getAllTags),
};