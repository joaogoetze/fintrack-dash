import {
  createRecurringTransactionSchema,
  updateRecurringTransactionSchema,
  recurringTransactionSchema,
  type RecurringTransactionsResponse,
  type RecurringTransaction,
  type CreateRecurringTransactionInput,
  type UpdateRecurringTransactionInput,
} from "../types";
import { api } from "./client";

export function getRecurringTransactions(type?: "income" | "expense"): Promise<RecurringTransactionsResponse> {
  const query = type ? `?type=${type}` : "";
  return api.get(`/recurring-transactions${query}`);
}

export function createRecurringTransaction(data: CreateRecurringTransactionInput): Promise<RecurringTransaction> {
  return api.post("/recurring-transactions", data, createRecurringTransactionSchema, recurringTransactionSchema);
}

export function updateRecurringTransaction(id: number, data: UpdateRecurringTransactionInput): Promise<RecurringTransaction> {
  return api.put(`/recurring-transactions/${id}`, data, updateRecurringTransactionSchema, recurringTransactionSchema);
}

export function deleteRecurringTransaction(id: number): Promise<void> {
  return api.delete(`/recurring-transactions/${id}`);
}
