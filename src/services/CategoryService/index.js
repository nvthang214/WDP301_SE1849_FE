import api from "../00-Axios";
import { 
  getAllCategories,
  getPopularCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "./urls";

export const CategoryService = {
  getAllCategories: async (params = {}) => await api.get(getAllCategories, { params }),
  getPopularCategories: async () => await api.get(getPopularCategories),
  createCategory: async (data) => await api.post(createCategory, data),
  updateCategory: async (id, data) => await api.put(updateCategory(id), data),
  deleteCategory: async (id) => await api.delete(deleteCategory(id)),
};