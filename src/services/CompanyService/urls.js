export const getAll = "/companies";
export const getById = (id) => `/companies/${id}`;
export const create = "/companies/create";
export const update = (id) => `/companies/edit/${id}`;
export const deleteCompany = (id) => `/companies/${id}`;
export const getByRecruiter = () => `/companies/recruiter`;