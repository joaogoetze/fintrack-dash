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

export function updateExpensePaid(id: number, paid: boolean) {
    return api.put(`/expenses/${id}/paid`, { paid });
}