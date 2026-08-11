export type Income = {
    id: number;
    name: string;
    value: number;
    is_recurrent: boolean;
    date: string;
    wallet_id?: number;
    wallet_name?: string;
}