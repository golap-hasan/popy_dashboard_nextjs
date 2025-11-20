import type { DashboardRevenuePoint } from "@/redux/feature/dashboard/dashboard.type";

export interface EarningGrowthChartProps {
  data: DashboardRevenuePoint[];
  yearlyTotal: number;
  years: number[];
  selectedYear?: number;
  onYearChange: (year: number) => void;
}

declare const EarningGrowthChart: React.FC<EarningGrowthChartProps>;

export default EarningGrowthChart;
