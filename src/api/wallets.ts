import { z } from "zod";

import { 
  walletSchema, 
  createWalletSchema, 
  updateWalletSchema,
  type Wallet,
  type CreateWalletInput,
  type UpdateWalletInput,
  type WalletsResponse
} from "../types";
import { api } from "./client";

const walletsResponseSchema = z.object({
  wallets: z.array(walletSchema),
  total: z.number(),
});

export function getWallets(): Promise<WalletsResponse> {
    return api.get("/wallets", walletsResponseSchema);
}

export function createWallet(data: CreateWalletInput): Promise<Wallet> {
    return api.post("/wallets", data, createWalletSchema, walletSchema);
}

export function updateWallet(id: number, data: UpdateWalletInput): Promise<Wallet> {
    return api.put(`/wallets/${id}`, data, updateWalletSchema, walletSchema);
}

export function deleteWallet(id: number): Promise<void> {
    return api.delete(`/wallets/${id}`);
}