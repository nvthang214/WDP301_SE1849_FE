//Categories
export const getAllCategories = "/categories";

//Popular Categories
export const getPopularCategories = "/categories/popular";

//Admin Category Management
export const createCategory = "/categories/create";
export const updateCategory = (id) => `/categories/edit/${id}`;
export const deleteCategory = (id) => `/categories/${id}`;