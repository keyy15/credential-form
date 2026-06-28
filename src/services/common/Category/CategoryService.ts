import { axiosProductGatewayClient } from "../../api/axiosClient";
import { CategoryStats } from "../../../types/Category";

const CategoryService = {
  getAllCategories: () =>
    axiosProductGatewayClient.get<CategoryStats>("/categories"),

  getCategoryById: (id: string) =>
    axiosProductGatewayClient.get<CategoryStats>(`/category/${id}`),

  createCategory: (data: Partial<CategoryStats>) =>
    axiosProductGatewayClient.post<CategoryStats>("/category", data),

  updateCategory: (id: string, data: Partial<CategoryStats>) =>
    axiosProductGatewayClient.put<CategoryStats>(`/category/${id}`, data),

  deleteCategory: (id: string) =>
    axiosProductGatewayClient.delete<{ message: string }>(`/category/${id}`),
};

export default CategoryService;
