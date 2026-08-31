import { api } from "./client";

export function getWallets() {
    return api.get("/wallets");
}

export function createWallet(data: {
    name: string;
    value: number;
}) {
    return api.post("/wallets", data);
}

export function updateWallet(id: number, data: { value: number, operation: string }) {
    return api.put(`/wallets/${id}`, data);
}

export function updateWalletName(id: number, name: string) {
    return api.put(`/wallets/${id}/name`, { name });
}

export function deleteWallet(id: number) {
    return api.delete(`/wallets/${id}`);
}