import api from "../00-Axios";
import { 
  getAll, 
  getByLocation, 
  getById, 
  create, 
  update, 
  deleteCompany, 
  getByRecruiter, 
  getCompanyDetails 
} from "./urls";


export const CompanyService = {
  getCompanies: async (params = {}) => {
    const response = await api.get(getAll, { params });
    return response;
  },
  getCompanyById: async (id) => {
    const response = await api.get(getById(id));
    return response;
  },
  getCompanyByRecruiter: async () => {
    const response = await api.get(getByRecruiter());
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
  getCompanyDetails: async (id) => {
    const response = await api.get(getCompanyDetails(id));
    return response;
  },
  getAllCompanies: async (params = {}) => {
    const response = await api.get(getAll, { params });
    return response;
  },
  getCompaniesByLocation: async (params = {}) => {
    const response = await api.get(getByLocation, { params });
    return response;
  },
};

export default CompanyService;
