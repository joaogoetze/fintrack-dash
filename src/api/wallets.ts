import { 
  walletSchema, 
  createWalletSchema, 
  updateWalletSchema,
  type Wallet,
  type CreateWalletInput,
  type UpdateWalletInput
} from "../types";
import { api } from "./client";

export function getWallets(): Promise<Wallet[]> {
    return api.get("/wallets");
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