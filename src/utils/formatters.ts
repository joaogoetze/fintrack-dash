const MAX_CENTS_DIGITS = 12;

export function formatCurrency(value: string | number | null | undefined): string {
  if (!value && value !== 0) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function reaisToCents(reais: number): number {
  if (!Number.isFinite(reais)) return 0;
  return Math.round(reais * 100);
}

export function centsToReais(cents: number): number {
  return cents / 100;
}

export function formatCentsToBRL(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const formatted = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(centsToReais(cents)));

  return `R$ ${sign}${formatted}`;
}

export function parseDigitsToCents(raw: string): number {
  const digits = raw.replace(/\D/g, "").slice(0, MAX_CENTS_DIGITS);
  return Number(digits || "0");
}

export function formatDate(date: string | null): string | null {
  if (!date) return null;
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function toDateInputValue(value: string |null): string {
  if (!value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

export function todayLocal(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
