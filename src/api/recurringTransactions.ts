import type { RecurringTransactionsResponse } from "../types";
import { api } from "./client";

export function getRecurringTransactions(type?: "income" | "expense"): Promise<RecurringTransactionsResponse> {
  const query = type ? `?type=${type}` : "";
  return api.get(`/recurring-transactions${query}`);
}

