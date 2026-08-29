export type Income = {
    id: number;
    name: string;
    amount: number;
    date: string;
    due_date: string;
    wallet_id?: number;
    wallet_name?: string;
    paid: boolean;
}