import api from "../00-Axios";
import { getAllCategories } from "./urls";

export const CategoryService = {
  getAllCategories: async () => await api.get(getAllCategories),
};