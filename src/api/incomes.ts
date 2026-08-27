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

export function updateIncomePaid(id: number, paid: boolean) {
    return api.put(`/incomes/${id}/paid`, { paid });
}