export type Expense = {
    id: number;
    name: string;
    amount: string;
    date: string;
    due_date: string;
    wallet_id?: number;
    wallet_name?: string;
    paid: boolean;
}