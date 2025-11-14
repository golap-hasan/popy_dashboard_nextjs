"use client";

import { Search } from "lucide-react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import CategoryTable from "./CategoryTable";
import PageLayout from "@/layout/PageLayout";
import AddCategoryModal from "./AddCategoryModal";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import { useGetAllCategoryQuery } from "@/redux/feature/category/categoryApi";
import {
  Category,
  CategoryQueryParams,
} from "@/redux/feature/category/category.type";

const Categories = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    data, // Category[]
    meta, // { page, limit, total, totalPage }
    isLoading,
    isError,
  } = useSmartFetchHook<CategoryQueryParams, Category>(
    useGetAllCategoryQuery,
    {}
  );

  return (
    <PageLayout
      pagination={
        meta?.totalPage &&
        meta.totalPage > 1 && (
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
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <Title title="CATEGORIES MANAGEMENT" length={meta?.total} />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <AddCategoryModal />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <Error msg="Failed to load categories." />
      ) : data?.length > 0 ? (
        <CategoryTable
          data={data}
          page={currentPage}
          limit={meta?.limit ?? 10}
        />
      ) : (
        <NoData msg="No categories found." />
      )}
    </PageLayout>
  );
};

export default Categories;
