import { api } from "./client";

export function getSumary(activeMonth: any) {
    return api.get(`/dashboard/sumary/${activeMonth}`);
}