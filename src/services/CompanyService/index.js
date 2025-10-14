import api from "../00-Axios";
import { getAll, getById, create, update, deleteCompany } from "./urls";

// Thêm params vào getCompanies
const getCompanies = async (params = {}) => await api.get(getAll, { params });

export const CompanyService = {
  getCompanies: async (params = {}) => {
    const response = await api.get(getAll, { params });
    return response; // response đã là data từ interceptor
  },
  getCompanyById: async (id) => {
    const response = await api.get(getById(id));
    return response;
  },
  createCompany: async (data) => {
    const response = await api.post(create, data);
    return response;
  },
  updateCompany: async (id, data) => {
    const response = await api.put(update(id), data);
    return response;
  },
  deleteCompany: async (id) => {
    const response = await api.delete(deleteCompany(id));
    return response;
  },
};

