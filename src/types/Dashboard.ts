import { z } from "zod";

export const summarySchema = z.object({
  totalExpenses: z.coerce.number(),
  totalIncome: z.coerce.number(),
  balance: z.coerce.number(),
});

export type Summary = z.infer<typeof summarySchema>;

export const dueExpenseSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.coerce.number(),
  date: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  walletId: z.number().nullable().optional(),
  walletName: z.string().optional().nullable(),
  recurringTransactionId: z.number().nullable().optional(),
  paid: z.boolean().optional(),
});

export type DueExpense = z.infer<typeof dueExpenseSchema> & {
  date: string;
  dueDate: string;
  walletId: number | null;
  walletName?: string;
  recurringTransactionId: number | null;
  paid: boolean;
};

export const dueTransactionSchema = dueExpenseSchema.extend({
  type: z.enum(["income", "expense"]),
});

export type DueTransaction = z.infer<typeof dueTransactionSchema> & {
  date: string;
  dueDate: string;
  walletId: number | null;
  walletName?: string;
  recurringTransactionId: number | null;
  paid: boolean;
  type: "income" | "expense";
};

export const dueTransactionsResponseSchema = z.array(dueTransactionSchema);

export type DueTransactionsResponse = z.infer<typeof dueTransactionsResponseSchema>;