import { z } from "zod";

const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  deletedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
});

const categoriesResponseSchema = z.object({
  categories: z.array(categorySchema),
  total: z.number(),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;

export const createCategorySchema = categorySchema.omit({ id: true, deletedAt: true, createdAt: true });
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = categorySchema.omit({ id: true, deletedAt: true, createdAt: true });
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type Category = z.infer<typeof categorySchema>;

export { categorySchema };
