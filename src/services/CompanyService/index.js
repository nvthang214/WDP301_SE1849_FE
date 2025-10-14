import api from "../00-Axios";
import { getById } from "./urls";

export const CompanyService = {
  getCompanyById: async (id) => await api.get(getById(id)),
};
