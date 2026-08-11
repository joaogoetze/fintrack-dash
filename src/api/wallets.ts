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