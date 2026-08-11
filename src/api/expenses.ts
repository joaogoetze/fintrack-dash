import { api } from "./client";

export function getExpenses(activeMonth: any) {
    console.log("active", activeMonth);
    console.log("tipo", typeof activeMonth);
      
    return api.get(`/expenses/${activeMonth}`,);
}

export function createExpense(data: {
    name: string;   
    value: string;
    date: string;
    is_recurring: boolean;
    wallet_id?: number;
}) {
    return api.post("/expenses", data);
}