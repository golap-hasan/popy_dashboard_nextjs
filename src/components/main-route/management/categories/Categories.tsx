"use client";

import Title from "@/components/ui/Title";
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
    data,
    isLoading,
    isError,
  } = useSmartFetchHook<CategoryQueryParams, Category>(
    useGetAllCategoryQuery,
    {}
  );

  return (
    <PageLayout>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <Title title="CATEGORIES MANAGEMENT" />
        </div>
        <div className="flex items-center gap-4">
          <AddCategoryModal />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <Error msg="Failed to load categories." />
      ) : data?.length > 0 ? (
        <CategoryTable data={data} />
      ) : (
        <NoData msg="No categories found." />
      )}
    </PageLayout>
  );
};

export default Categories;
