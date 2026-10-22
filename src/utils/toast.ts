import { toast } from "sonner";

import { SessionExpiredError } from "./errors";

export function getErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof Error && err.message) return err.message;
    return fallback;
}

export function toastApiError(err: unknown, fallback: string): void {
    if (err instanceof SessionExpiredError) return;
    toast.error(getErrorMessage(err, fallback));
}
