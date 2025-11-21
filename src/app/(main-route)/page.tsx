"use client";
import { useState, type ComponentType } from "react";
import { BookOpen, CloudAlert, MoveRight } from "lucide-react";

import DashboardStats from "@/components/dashboard/DashboardStats";
import EarningGrowthChart from "@/components/dashboard/EarningGrowthChart";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import PageLayout from "@/layout/PageLayout";
import { Button } from "@/components/ui/button";
import OrderTable from "@/components/main-route/management/orders/OrderTable";
import { useGetDashboardDataQuery } from "@/redux/feature/dashboard/dashboardApi";
import type {
  DashboardUserGrowthSeriesItem,
  DashboardRevenueSeriesItem,
  DashboardRevenuePoint,
  DashboardUserGrowthPoint,
} from "@/redux/feature/dashboard/dashboard.type";
import Link from "next/link";

const TABLE_LIMIT = 4;

type UserGrowthChartComponent = ComponentType<{
  data: DashboardUserGrowthPoint[];
  years: number[];
  selectedYear?: number;
  onYearChange: (year: number) => void;
}>;

type EarningGrowthChartComponent = ComponentType<{
  data: DashboardRevenuePoint[];
  yearlyTotal: number;
  years: number[];
  selectedYear?: number;
  onYearChange: (year: number) => void;
}>;

const TypedUserGrowthChart = UserGrowthChart as UserGrowthChartComponent;
const TypedEarningGrowthChart = EarningGrowthChart as EarningGrowthChartComponent;

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardDataQuery(undefined);

  const stats = data?.data?.stats;
  const userGrowthSeries = (data?.data?.userGrowthSeries ?? []) as DashboardUserGrowthSeriesItem[];
  const revenueSeries = (data?.data?.revenueSeries ?? []) as DashboardRevenueSeriesItem[];
  const pendingOrders = (data?.data?.pendingOrders ?? []).slice(0, TABLE_LIMIT);

  const [userYear, setUserYear] = useState<number | undefined>(() =>
    userGrowthSeries[userGrowthSeries.length - 1]?.year
  );
  const [earningYear, setEarningYear] = useState<number | undefined>(() =>
    revenueSeries[revenueSeries.length - 1]?.year
  );

  const userYears = userGrowthSeries.map((series) => series.year);
  const revenueYears = revenueSeries.map((series) => series.year);

  const effectiveUserYear = userYear ?? userYears[userYears.length - 1];
  const effectiveEarningYear = earningYear ?? revenueYears[revenueYears.length - 1];

  const userGrowthData = userGrowthSeries.find(s => s.year === effectiveUserYear)?.data || [];
  const revenueDataEntry = revenueSeries.find(s => s.year === effectiveEarningYear) || { data: [], yearlyTotal: 0 };

  const formattedUserData = userGrowthData.map(item => ({
    month: item.month,
    users: Number(item.users) || 0
  }));

  const formattedRevenueData = revenueDataEntry.data.map(item => ({
    month: item.month,
    income: Number(item.income) || 0
  }));

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <BookOpen className="animate-bounce size-10" />
      </div>
    );
  }

  if (!isError || !data) {
    return (
      <div className="h-[80vh] flex gap-4 items-center justify-center">
        <CloudAlert className="size-10 text-red-400" />
        <p className="text-center text-red-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <PageLayout>
      {stats && <DashboardStats data={stats} />}

      {userYears.length > 0 && revenueYears.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <TypedUserGrowthChart
            data={formattedUserData}
            years={userYears}
            selectedYear={effectiveUserYear}
            onYearChange={(year: number) => setUserYear(Number(year))}
          />
          <TypedEarningGrowthChart
            data={formattedRevenueData}
            yearlyTotal={revenueDataEntry.yearlyTotal}
            years={revenueYears}
            selectedYear={effectiveEarningYear}
            onYearChange={(year: number) => setEarningYear(Number(year))}
          />
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Pending orders</h3>
          <Link
            href="/management/orders"
            className="text-primary hover:underline text-sm font-medium"
          >
            <Button variant="ghost">
              View all <MoveRight />
            </Button>
          </Link>
        </div>

        {pendingOrders.length > 0 ? (
          <OrderTable data={pendingOrders} page={1} limit={TABLE_LIMIT} />
        ) : (
          <p className="text-center text-muted-foreground">No pending orders</p>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
