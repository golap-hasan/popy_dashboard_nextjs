import type { DashboardUserGrowthPoint } from "@/redux/feature/dashboard/dashboard.type";

export interface UserGrowthChartProps {
  data: DashboardUserGrowthPoint[];
  years: number[];
  selectedYear?: number;
  onYearChange: (year: number) => void;
}

declare const UserGrowthChart: React.FC<UserGrowthChartProps>;

export default UserGrowthChart;
