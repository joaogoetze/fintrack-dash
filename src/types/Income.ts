import { z } from "zod";

const incomeSchema = z.object({
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

export const createIncomeSchema = incomeSchema
  .omit({ id: true, deletedAt: true, walletName: true })
  .partial({
    walletId: true,
    recurringTransactionId: true,
    dueDate: true,
    paid: true,
  });

export const createIncomeOptionsSchema = z.object({
  isRecurring: z.boolean().optional(),
});

export const createIncomeRequest = createIncomeSchema.merge(createIncomeOptionsSchema);

export type CreateIncomeInput = z.infer<typeof createIncomeRequest>;

export const updateIncomeSchema = incomeSchema
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

export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;

export const updateIncomePaidStatusSchema = z.object({
  paid: z.boolean(),
  walletId: z.number().nullable().optional(),
  amount: z.coerce.number().optional(),
});

export type UpdateIncomePaidStatusInput = z.infer<typeof updateIncomePaidStatusSchema>;

export type Income = z.infer<typeof incomeSchema>;

export { incomeSchema };