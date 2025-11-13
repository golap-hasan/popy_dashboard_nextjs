"use client";
import Title from "@/components/ui/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import PageLayout from "@/layout/PageLayout";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Search } from "lucide-react";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import BookTable from "@/components/main-route/management/books/BookTable";
import CustomPagination from "@/common/CustomPagination";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetAllBookQuery } from "@/redux/feature/book/bookApi";
import { Book, BookQueryParams } from "@/redux/feature/book/book.type";

const Books = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data, // Book[]
    meta, // { page, limit, total, totalPage }
    isLoading,
    isError,
  } = useSmartFetchHook<BookQueryParams, Book>(useGetAllBookQuery, {});

  return (
    <PageLayout
      pagination={
        <CustomPagination
          currentPage={currentPage}
          totalPages={meta?.totalPage ?? 1}
          onPageChange={(page) => setCurrentPage(page)}
        />
      }
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Title title="BOOKS MANAGEMENT" length={meta?.total} />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books or authors..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/management/books/add">
            <Button>Add Book</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <Error msg="Failed to load books." />
      ) : data?.length > 0 ? (
        <BookTable data={data} page={currentPage} limit={meta?.limit ?? 10} />
      ) : (
        <NoData msg="No books found." />
      )}
    </PageLayout>
  );
};

export default Books;
