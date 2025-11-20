"use client";

import { useMemo } from "react";
import { Plus, Search } from "lucide-react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import PageLayout from "@/layout/PageLayout";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import AdminTable from "./Admintable";
import { Button } from "@/components/ui/button";
import CreateAdminModal from "./CreateAdminModal";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import {
  useGetAllAdminQuery,
} from "@/redux/feature/admin/adminApi";
import type {
  Admin,
  AdminQueryParams,
} from "@/redux/feature/admin/admin.types";

const PAGE_LIMIT = 10;

const Admins = () => {

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data, // Admin[]
    isLoading,
    isError,
  } = useSmartFetchHook<AdminQueryParams, Admin>(
    useGetAllAdminQuery,
    {}
  );

  const filteredAdmins = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowercasedTerm = searchTerm.toLowerCase();
    return data.filter((admin) => {
      const nameMatch = admin.name?.toLowerCase().includes(lowercasedTerm);
      const emailMatch = admin.email?.toLowerCase().includes(lowercasedTerm);
      const phoneMatch = admin.phone?.includes(searchTerm);
      const roleMatch = admin.role?.toLowerCase().includes(lowercasedTerm);

      return nameMatch || emailMatch || phoneMatch || roleMatch;
    });
  }, [data, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_LIMIT));

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * PAGE_LIMIT;
    return filteredAdmins.slice(start, start + PAGE_LIMIT);
  }, [filteredAdmins, currentPage]);

  return (
    <>
      <PageLayout
        pagination={
          filteredAdmins.length > PAGE_LIMIT && (
            <div className="mt-4">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )
        }
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <Title title="ADMIN MANAGEMENT" length={data.length} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role"
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <CreateAdminModal>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Admin
              </Button>
            </CreateAdminModal>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <Error msg="Failed to load admins." />
        ) : filteredAdmins.length > 0 ? (
          <AdminTable
            data={paginatedAdmins}
            page={currentPage}
            limit={PAGE_LIMIT}
          />
        ) : (
          <NoData msg="No admins found." />
        )}
      </PageLayout>
    </>
  );
};

export default Admins;
