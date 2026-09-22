import { z } from "zod";

import { 
  expenseSchema, 
  createExpenseRequest, 
  updateExpenseSchema,
  updateExpensePaidStatusSchema,
  type Expense,
  type CreateExpenseInput,
  type UpdateExpenseInput,
  type UpdateExpensePaidStatusInput
} from "../types";
import { api } from "./client";

const expensesResponseSchema = z.object({
  expenses: z.array(expenseSchema),
  total: z.number(),
});

type ExpensesResponse = z.infer<typeof expensesResponseSchema>;

export function getExpenses(activeMonth: string): Promise<ExpensesResponse> {
    return api.get(`/expenses/${activeMonth}`, expensesResponseSchema);
}

export function createExpense(data: CreateExpenseInput): Promise<Expense> {
    return api.post("/expenses", data, createExpenseRequest, expenseSchema);
}

export function updateExpensePaid(id: number, paid: boolean, walletId?: number, amount?: number): Promise<Expense> {
    const data: UpdateExpensePaidStatusInput = { paid, walletId, amount };
    return api.put(`/expenses/${id}/paid`, data, updateExpensePaidStatusSchema, expenseSchema);
}

export function updateExpense(id: number, data: UpdateExpenseInput): Promise<Expense> {
    return api.put(`/expenses/${id}`, data, updateExpenseSchema, expenseSchema);
}

export function deleteExpense(id: number): Promise<void> {
    return api.delete(`/expenses/${id}`);
}