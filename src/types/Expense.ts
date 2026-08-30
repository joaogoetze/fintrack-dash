export type Expense = {
    id: number;
    name: string;
    amount: string;
    date: string;
    due_date: string;
    wallet_id?: number;
    wallet_name?: string;
    recurring_transaction_id?: number;
    paid: boolean;
}