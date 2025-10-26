import api from "../00-Axios";
import { 
  getAllCategories,
  getPopularCategories
} from "./urls";

export const CategoryService = {
  getAllCategories: async () => await api.get(getAllCategories),
  getPopularCategories: async () => await api.get(getPopularCategories),
};