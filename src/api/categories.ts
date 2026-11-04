import { 
  categorySchema, 
  createCategorySchema, 
  updateCategorySchema,
  type Category,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type CategoriesResponse
} from "../types";
import { api } from "./client";

export function getCategories(): Promise<CategoriesResponse> {
  return api.get("/categories");
}

export function createCategory(data: CreateCategoryInput): Promise<Category> {
  return api.post("/categories", data, createCategorySchema, categorySchema);
}

export function updateCategory(id: number, data: UpdateCategoryInput): Promise<Category> {
  return api.put(`/categories/${id}`, data, updateCategorySchema, categorySchema);
}

export function deleteCategory(id: number): Promise<void> {
  return api.delete(`/categories/${id}`);
}
