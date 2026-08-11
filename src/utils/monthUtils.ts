export const dateToKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

export const keyToDate = (key: string): Date => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1);
};

export const generateMonths = (start: Date, count: number): string[] => {
  const months: string[] = [];
  const current = new Date(start);
  current.setDate(1);
  for (let i = 0; i < count; i++) {
    months.push(dateToKey(current));
    current.setMonth(current.getMonth() + 1);
  }
  return months;
};

export const getShortMonthName = (key: string): string => {
  const date = keyToDate(key);
  const name = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date);
  return name.replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
};
