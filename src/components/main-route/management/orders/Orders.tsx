"use client";
import { Suspense } from "react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import { Search } from "lucide-react";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import PageLayout from "@/layout/PageLayout";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import OrderTable from "./OrderTable";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetAllOrderQuery } from "@/redux/feature/order/orderApi";
import { Order, OrderQueryParams } from "@/redux/feature/order/order.type";

const Orders = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data, // Order[]
    meta, // { page, limit, total, totalPage }
    isLoading,
    isError,
  } = useSmartFetchHook<OrderQueryParams, Order>(useGetAllOrderQuery, {});

  return (
    <Suspense fallback={<TableSkeleton />}>
      <PageLayout
        pagination={
          meta?.totalPage && meta.totalPage > 1 && (
            <div className="mt-4">
              <CustomPagination
                currentPage={currentPage}
                totalPages={meta.totalPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )
        }
      >
        {/* Title and Search */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start justify-between mb-4">
          <Title title="ORDERS MANAGEMENT" length={meta?.total} />
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <Error msg="Error loading orders" />
        ) : data?.length > 0 ? (
          <OrderTable
            data={data}
            page={currentPage}
            limit={meta?.limit ?? 10}
          />
        ) : (
          <NoData msg="No orders found." />
        )}
      </PageLayout>
    </Suspense>
  );
};

export default Orders;
