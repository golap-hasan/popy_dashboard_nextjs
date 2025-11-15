"use client"
import { Suspense } from "react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import { Search } from "lucide-react";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import PageLayout from "@/layout/PageLayout";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import UsersTable from "./UsersTable";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetAllUserQuery } from "@/redux/feature/user/userApi";
import { User, UserQueryParams } from "@/redux/feature/user/user.type";

const Users = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data, // User[]
    meta, // { page, limit, total, totalPage }
    isLoading,
    isError,
  } = useSmartFetchHook<UserQueryParams, User>(useGetAllUserQuery, {});

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
          <Title title="USERS MANAGEMENT" length={meta?.total} />
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
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
          <Error msg="Error loading users" />
        ) : data?.length > 0 ? (
          <UsersTable
            data={data}
            page={currentPage}
            limit={meta?.limit ?? 10}
          />
        ) : (
          <NoData msg="No users found." />
        )}
      </PageLayout>
    </Suspense>
  );
};

export default Users;
