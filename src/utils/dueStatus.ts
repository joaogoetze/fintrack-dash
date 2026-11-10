import { toDateInputValue } from "./formatters";

export type DueStatus = "due-paid" | "due-today" | "due-soon" | "due-later" | "past-due";

interface DueDateInfo {
  paid: boolean;
  dueDate?: string | null;
}

export function getDueStatus({ paid, dueDate }: DueDateInfo): DueStatus {
  if (paid) return "due-paid";

  const dueStr = toDateInputValue(dueDate ?? null);
  if (!dueStr) return "due-later";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(dueStr + "T00:00:00");

  if (due.getTime() === today.getTime()) return "due-today";

  if (due < today) return "past-due";

  const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return "due-soon";

  return "due-later";
}
