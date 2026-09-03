import { api } from "./client";

export function getSumary(activeMonth: any) {
    return api.get(`/dashboard/sumary/${activeMonth}`);
}

export function getDueExpenses(activeMonth: any) {
    return api.get(`/dashboard/dues/${activeMonth}`);
}