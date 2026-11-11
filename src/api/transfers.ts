import { 
  transferSchema, 
  createTransferSchema, 
  type Transfer, 
  type CreateTransferInput 
} from "../types";
import { api } from "./client";

export function createTransfer(data: CreateTransferInput): Promise<Transfer> {
  return api.post("/transfers", data, createTransferSchema, transferSchema);
}

