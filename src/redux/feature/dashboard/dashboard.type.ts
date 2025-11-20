export type DashboardStats = {
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
};

export type DashboardUserGrowthPoint = {
  month: string;
  users: number;
};

export type DashboardUserGrowthSeriesItem = {
  year: number;
  data: DashboardUserGrowthPoint[];
};

export type DashboardRevenuePoint = {
  month: string;
  income: number;
};

export type DashboardRevenueSeriesItem = {
  year: number;
  data: DashboardRevenuePoint[];
  yearlyTotal: number;
};

export type DashboardMetaDataResponse = {
  success: boolean;
  message: string;
  data: {
    stats: DashboardStats;
    userGrowthSeries: DashboardUserGrowthSeriesItem[];
    revenueSeries: DashboardRevenueSeriesItem[];
    pendingOrders: unknown[];
  };
};

