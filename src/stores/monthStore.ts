import { create } from "zustand";
import { persist } from "zustand/middleware";

import { dateToKey } from "../utils/monthUtils";

interface MonthStore {
    activeMonth: string;
    setActiveMonth: (month: string) => void;
}

const MONTH_PATTERN = /^\d{4}-\d{2}$/;

const currentMonth = () => dateToKey(new Date());

export const useMonthStore = create<MonthStore>()(
    persist(
        (set) => ({
            activeMonth: currentMonth(),
            setActiveMonth: (month) => set({ activeMonth: month }),
        }),
        {
            name: "fintrack:month",
            version: 1,
            partialize: (state) => ({ activeMonth: state.activeMonth }),
            merge: (persisted, current) => {
                const month = (persisted as Partial<MonthStore> | undefined)?.activeMonth;
                return {
                    ...current,
                    activeMonth: month && MONTH_PATTERN.test(month) ? month : currentMonth(),
                };
            },
        }
    )
);