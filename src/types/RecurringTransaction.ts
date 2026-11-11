import { z } from "zod";

const recurringTransactionSchema = z.object({
  id: z.number(),
  type: z.enum(["income", "expense"]),
  name: z.string().min(1, "Nome é obrigatório"),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  startDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  workspaceId: z.number().optional(),
  categoryId: z.number().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export const createRecurringTransactionSchema = recurringTransactionSchema.omit({ id: true, deletedAt: true });

export type CreateRecurringTransactionInput = z.infer<typeof createRecurringTransactionSchema>;

export const updateRecurringTransactionSchema = recurringTransactionSchema
  .omit({ id: true, type: true, startDate: true, deletedAt: true })
  .partial();

export type UpdateRecurringTransactionInput = z.infer<typeof updateRecurringTransactionSchema>;

export type RecurringTransaction = z.infer<typeof recurringTransactionSchema>;

export interface RecurringTransactionsResponse {
  recurringTransactions: RecurringTransaction[];
  total: number;
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
}

export { recurringTransactionSchema };
