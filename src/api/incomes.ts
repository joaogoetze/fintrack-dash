import { api } from "./client";

export function getIncomes(activeMonth: any) {
    return api.get(`/incomes/${activeMonth}`);
}

export function createIncome(data: {
    name: string;
    value: number;
    date: string;
    due_date?: string;
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
    value: number;
    date: string;
    due_date?: string;
    wallet_id?: number;
}) {
    return api.put(`/incomes/${id}`, data);
}

export function deleteIncome(id: number) {
    return api.delete(`/incomes/${id}`);
}