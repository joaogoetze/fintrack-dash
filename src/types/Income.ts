export type Income = {
    id: number;
    name: string;
    value: number;
    date: string;
    due_date: string;
    wallet_id?: number;
    wallet_name?: string;
    recurring_transaction_id?: number;
    paid: boolean;
}