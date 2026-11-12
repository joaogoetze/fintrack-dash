import { z } from "zod";

const nullableAmount = z.preprocess(
  (val) => (val === "" || val === undefined ? null : val),
  z.coerce.number().nullable().optional()
);

const nullableMargin = z.preprocess(
  (val) => (val === "" || val === undefined ? null : val),
  z.coerce.number().min(0).max(100).nullable().optional()
);

const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  estimatedAmount: z.coerce.number().nullable().optional(),
  marginPercent: z.coerce.number().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
});

const categoriesResponseSchema = z.object({
  categories: z.array(categorySchema),
  total: z.number(),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;

export const createCategorySchema = categorySchema
  .omit({ id: true, deletedAt: true, createdAt: true })
  .extend({
    estimatedAmount: nullableAmount,
    marginPercent: nullableMargin,
  });
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = categorySchema
  .omit({ id: true, deletedAt: true, createdAt: true })
  .extend({
    estimatedAmount: nullableAmount,
    marginPercent: nullableMargin,
  });
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type Category = z.infer<typeof categorySchema>;

export { categorySchema };
