import { api } from "./client";

export function getExpenses(activeMonth: any) {
      
    return api.get(`/expenses/${activeMonth}`,);
}

export function createExpense(data: {
    name: string;   
    value: string;
    date: string;
    due_date?: string;
    is_recurring: boolean;
    wallet_id?: number;
}) {
    return api.post("/expenses", data);
}

export function updateExpensePaid(id: number, paid: boolean, wallet_id?: number, value?: number) {
    return api.put(`/expenses/${id}/paid`, { paid, wallet_id, value });
}

export function updateExpense(id: number, data: {
    name: string;
    value: string;
    date: string;
    due_date?: string;
    wallet_id?: number;
}) {
    return api.put(`/expenses/${id}`, data);
}

export function deleteExpense(id: number) {
    return api.delete(`/expenses/${id}`);
}