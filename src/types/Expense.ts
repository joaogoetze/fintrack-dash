import { z } from "zod";

const expenseSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome é obrigatório"),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  date: z.string().date("Data inválida"),
  walletId: z.number().nullable(),
  walletName: z.string().optional().nullable(),
  recurringTransactionId: z.number().nullable(),
  dueDate: z.string().date("Data de vencimento inválida").nullable(),
  paid: z.boolean(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export const createExpenseSchema = expenseSchema
  .omit({ id: true, deletedAt: true, walletName: true })
  .partial({
    walletId: true,
    recurringTransactionId: true,
    dueDate: true,
    paid: true,
  });

export const createExpenseOptionsSchema = z.object({
  isRecurring: z.boolean(),
});

export const createExpenseRequest = createExpenseSchema.merge(createExpenseOptionsSchema);

export type CreateExpenseInput = z.infer<typeof createExpenseRequest>;

export const updateExpenseSchema = expenseSchema
  .omit({ deletedAt: true, walletName: true })
  .partial({
    name: true,
    amount: true,
    date: true,
    dueDate: true,
    walletId: true,
    recurringTransactionId: true,
    paid: true,
  })
  .extend({
    updateRecurringTransaction: z.boolean().optional(),
  });

export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

export const updateExpensePaidStatusSchema = z.object({
  paid: z.boolean(),
  walletId: z.number().nullable().optional(),
  amount: z.coerce.number().optional(),
});

export type UpdateExpensePaidStatusInput = z.infer<typeof updateExpensePaidStatusSchema>;

export type Expense = z.infer<typeof expenseSchema>;

export { expenseSchema };