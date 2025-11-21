"use client";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Search } from "lucide-react";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import PageLayout from "@/layout/PageLayout";
import ContactTable from "./ContactTable";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetCustomerHelpQuery } from "@/redux/feature/legal/legalApi";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isReplied: boolean;
  createdAt: string;
};

type ContactQueryParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
};

const Contacts = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data,
    meta,
    isLoading,
    isError,
  } = useSmartFetchHook<ContactQueryParams, Contact>(useGetCustomerHelpQuery, {});

  return (
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
      <div className="flex flex-col gap-3 md:flex-row md:items-start justify-between mb-4">
        <Title title="CONTACTS MANAGEMENT" length={meta?.total} />
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search contacts"
            className="w-full pl-10 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <Error msg="Failed to load contacts." />
      ) : data?.length > 0 ? (
        <ContactTable data={data} page={currentPage} limit={meta?.limit ?? 10} />
      ) : (
        <NoData msg="No contacts found." />
      )}
    </PageLayout>
  );
};

export default Contacts;
