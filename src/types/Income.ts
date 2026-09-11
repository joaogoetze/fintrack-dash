export type Income = {
    id: number;
    name: string;
    amount: string;
    date: string;
    due_date: string | null;
    wallet_id?: number;
    wallet_name?: string;
    recurring_transaction_id?: number | null;
    paid: boolean;
}