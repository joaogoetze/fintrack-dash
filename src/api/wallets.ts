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

export function updateWallet(id: number, data: { name: string; value: number }) {
    return api.put(`/wallets/${id}/update`, data);
}

export function deleteWallet(id: number) {
    return api.delete(`/wallets/${id}`);
}