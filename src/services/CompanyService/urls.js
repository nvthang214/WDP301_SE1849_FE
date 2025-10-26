export const getAll = "/companies";
export const getByLocation = "/companies/location";
export const getById = (id) => `/companies/${id}`;
export const create = "/companies/create";
export const update = (id) => `/companies/edit/${id}`;
export const deleteCompany = (id) => `/companies/${id}`;
export const getByRecruiter = () => `/companies/recruiter/my-company`;
export const getCompanyDetails = (id) => `/companies/details/${id}`;