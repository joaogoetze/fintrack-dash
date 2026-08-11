import { create } from "zustand";
import { dateToKey } from "../utils/monthUtils";

interface MonthStore {
    activeMonth: string;
    setActiveMonth: (month: string) => void;
}

export const useMonthStore = create<MonthStore>((set) => ({
    activeMonth: dateToKey(new Date()),
    setActiveMonth: (month) => set({ activeMonth: month }),
}));