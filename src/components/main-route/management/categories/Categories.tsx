"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import { categories, categories as seedCategories } from "./categoryData";
import CategoryTable from "./CategoryTable";
import PageLayout from "@/layout/PageLayout";
import { Button } from "@/components/ui/button";
import AddCategoryModal from "./AddCategoryModal";

const PAGE_LIMIT = 10;

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchTerm = "";
  const totalPages = 2;
  const currentPage = 1;
  const setSearchTerm = () => {};
  const setCurrentPage = () => {};
  const isLoading = false;
  const isError = false;

  const handleAddCategory = (values: any) => {
    console.log(values);
  };

  return (
    <PageLayout
      pagination={
        totalPages > 1 && (
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
        <div className="flex items-center gap-4">
          <Title title="CATEGORIES MANAGEMENT" length={categories.length} />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
            <Button onClick={()=>setIsModalOpen(true)}>Add Category</Button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <Error msg="Failed to load categories." />
      ) : categories.length > 0 ? (
        <CategoryTable
          data={categories}
          page={currentPage}
          limit={PAGE_LIMIT}
        />
      ) : (
        <NoData msg="No categories found." />
      )}

      <AddCategoryModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleAddCategory}
      />
    </PageLayout>
  );
};

export default Categories;
