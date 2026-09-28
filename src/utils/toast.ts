import { toast } from "sonner";

export function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message) return err.message;
    return fallback;
}

export function toastApiError(err: unknown, fallback: string): void {
    toast.error(getErrorMessage(err, fallback));
}
