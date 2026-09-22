import { 
  summarySchema, 
  dueTransactionsResponseSchema,
  type Summary,
  type DueTransaction
} from "../types";
import { api } from "./client";

export function getSummary(activeMonth: string): Promise<Summary> {
    return api.get(`/dashboard/summary/${activeMonth}`, summarySchema);
}

export function getDueTransactions(activeMonth: string): Promise<DueTransaction[]> {
    return api.get(`/dashboard/dues/${activeMonth}`, dueTransactionsResponseSchema).then(data => 
        data.map(item => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            date: item.dueDate ?? item.date ?? "",
            dueDate: item.dueDate ?? "",
            walletId: item.walletId ?? null,
            walletName: item.walletName ?? undefined,
            recurringTransactionId: item.recurringTransactionId ?? null,
            paid: item.paid ?? false,
            type: item.type,
        }))
    );
}