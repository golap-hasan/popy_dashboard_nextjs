"use client";
import { useMemo, useState } from "react";
import { Link, MoveRight } from "lucide-react";

import DashboardStats from "@/components/dashboard/DashboardStats";
import EarningGrowthChart from "@/components/dashboard/EarningGrowthChart";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import PageLayout from "@/layout/PageLayout";
import { Button } from "@/components/ui/button";
import OrderTable from "@/components/main-route/management/orders/OrderTable";

import { books } from "@/components/main-route/management/books/bookData";
import { orders } from "@/components/main-route/management/orders/orderData";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const START_YEAR = 2023;
const YEAR_COUNT = 5;
const TABLE_LIMIT = 4;

const generateUserCount = (year: number, monthIdx: number) =>
  420 + (year - START_YEAR) * 35 + monthIdx * 22;
const generateRevenue = (year: number, monthIdx: number) =>
  320000 + (year - START_YEAR) * 48000 + monthIdx * 18000;

const userGrowthSeries = Array.from({ length: YEAR_COUNT }, (_, offset) => {
  const year = START_YEAR + offset;
  return {
    year,
    data: MONTH_LABELS.map((month, index) => ({
      month,
      users: generateUserCount(year, index),
    })),
  };
});

const revenueSeries = Array.from({ length: YEAR_COUNT }, (_, offset) => {
  const year = START_YEAR + offset;
  const data = MONTH_LABELS.map((month, index) => ({
    month,
    income: generateRevenue(year, index),
  }));
  const yearlyTotal = data.reduce((total, entry) => total + entry.income, 0);

  return {
    year,
    data,
    yearlyTotal,
  };
});

const paidOrders = orders.filter((order) => order.paymentStatus === "paid");

const dashboardStatsData = {
  totalBooks: books.length,
  totalOrders: orders.length,
  totalRevenue: paidOrders.reduce(
    (sum, order) => sum + order.book.unitPrice * order.quantity,
    0
  ),
  activeCustomers: new Set(orders.map((order) => order.customer.email)).size,
};

const pendingOrders = orders
  .filter(
    (order) => !["delivered", "cancelled"].includes(order.fulfilmentStatus)
  )
  .sort(
    (a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
  )
  .slice(0, TABLE_LIMIT);

const Dashboard = () => {
  const [userYear, setUserYear] = useState(
    userGrowthSeries[userGrowthSeries.length - 1]?.year ?? START_YEAR
  );
  const [earningYear, setEarningYear] = useState(
    revenueSeries[revenueSeries.length - 1]?.year ?? START_YEAR
  );

  const userGrowthData = useMemo(
    () =>
      userGrowthSeries.find((series) => series.year === userYear)?.data ?? [],
    [userYear]
  );

  const revenueDataEntry = useMemo(
    () =>
      revenueSeries.find((series) => series.year === earningYear) ?? {
        data: [],
        yearlyTotal: 0,
      },
    [earningYear]
  );

  return (
    <PageLayout>
      <DashboardStats data={dashboardStatsData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <UserGrowthChart
          data={userGrowthData as any}
          years={userGrowthSeries.map((series) => series.year) as any}
          selectedYear={userYear}
          onYearChange={(year: number) => setUserYear(Number(year))}
        />
        <EarningGrowthChart
          data={revenueDataEntry.data as any}
          yearlyTotal={revenueDataEntry.yearlyTotal}
          years={revenueSeries.map((series) => series.year) as any}
          selectedYear={earningYear}
          onYearChange={(year: number) => setEarningYear(Number(year))}
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Pending orders</h3>
          <Link
            to="/management/orders"
            className="text-primary hover:underline text-sm font-medium"
          >
            <Button variant="ghost">
              View all <MoveRight />
            </Button>
          </Link>
        </div>

        {pendingOrders.length > 0 ? (
          <OrderTable
            onBlock={(id: string) => {}}
            data={pendingOrders}
            page={1}
            limit={TABLE_LIMIT}
          />
        ) : (
          <p className="text-center text-muted-foreground">No pending orders</p>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
