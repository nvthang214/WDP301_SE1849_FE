import api from "../00-Axios";
import { getAllTags, createTag, updateTag, deleteTag } from "./urls";

export const TagService = {
  getAllTags: async (params = {}) => await api.get(getAllTags, { params }),
  createTag: async (data) => await api.post(createTag, data),
  updateTag: async (id, data) => await api.put(updateTag(id), data),
  deleteTag: async (id) => await api.delete(deleteTag(id)),
};