import { api } from "./client";

export function getIncomes(activeMonth: any) {
    return api.get(`/incomes/${activeMonth}`);
}

export function createIncome(data: {
    name: string;
    amount: string;
    date: string;
    due_date?: string | null;
    is_recurring: boolean;
    wallet_id?: number;
}) {
    return api.post("/incomes", data);
}

export function updateIncomePaid(id: number, paid: boolean, wallet_id?: number, value?: number) {
    return api.put(`/incomes/${id}/paid`, { paid, wallet_id, value });
}

export function updateIncome(id: number, data: {
    name: string;
    amount: string;
    date: string;
    due_date: string | null;
    wallet_id?: number;
    update_rec: boolean;
    recurring_transaction_id: number | null
}) {
    return api.put(`/incomes/${id}`, data);
}

export function deleteIncome(id: number) {
    return api.delete(`/incomes/${id}`);
}