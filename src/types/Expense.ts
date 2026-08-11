export type Expense = {
    id: number;
    name: string;
    amount: string;
    is_recurrent: boolean;
    date: string;
    wallet_id?: number;
    wallet_name?: string;
}