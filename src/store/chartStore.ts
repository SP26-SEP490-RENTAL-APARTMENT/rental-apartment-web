import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChartStore {
  chartData: any;
  setChartData: (data: any) => void;
  clearChartData: () => void;
}
export const useChartStore = create<ChartStore>()(
  persist(
    (set) => ({
      chartData: null,
      setChartData: (data) => set({ chartData: data }),
      clearChartData: () => set({ chartData: null }),
    }),
    {
      name: "chart-storage",
    },
  ),
);
