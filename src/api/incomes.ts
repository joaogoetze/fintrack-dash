import { z } from "zod";

import { 
  incomeSchema, 
  createIncomeRequest, 
  updateIncomeSchema,
  updateIncomePaidStatusSchema,
  type Income,
  type CreateIncomeInput,
  type UpdateIncomeInput,
  type UpdateIncomePaidStatusInput
} from "../types";
import { api } from "./client";

const incomesResponseSchema = z.object({
  incomes: z.array(incomeSchema),
  total: z.number(),
});

type IncomesResponse = z.infer<typeof incomesResponseSchema>;

export function getIncomes(activeMonth: string): Promise<IncomesResponse> {
    return api.get(`/incomes/${activeMonth}`, incomesResponseSchema);
}

export function createIncome(data: CreateIncomeInput): Promise<Income> {
    return api.post("/incomes", data, createIncomeRequest, incomeSchema);
}

export function updateIncomePaid(id: number, paid: boolean, walletId?: number, amount?: number): Promise<Income> {
    const data: UpdateIncomePaidStatusInput = { paid, walletId, amount };
    return api.put(`/incomes/${id}/paid`, data, updateIncomePaidStatusSchema, incomeSchema);
}

export function updateIncome(id: number, data: UpdateIncomeInput): Promise<Income> {
    return api.put(`/incomes/${id}`, data, updateIncomeSchema, incomeSchema);
}

export function deleteIncome(id: number): Promise<void> {
    return api.delete(`/incomes/${id}`);
}