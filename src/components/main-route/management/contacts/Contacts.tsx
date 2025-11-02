"use client";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Search } from "lucide-react";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import { contacts } from "./contactData";
import PageLayout from "@/layout/PageLayout";
import ContactTable from "./ContactTable";

const PAGE_LIMIT = 10;

const Contacts = () => {
  const searchTerm = "";
  const totalPages = 2;
  const currentPage = 1;
  const setSearchTerm = () => {};
  const setCurrentPage = () => {};
  const isLoading = false;
  const isError = false;

  return (
    <PageLayout
      pagination={
        <div className="mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      }
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
        <Title title="Contacts" />
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, email, or phone"
            className="pl-10 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm()}
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError ? (
        <Error msg="Failed to load contacts." />
      ) : contacts.length > 0 ? (
        <ContactTable data={contacts} page={currentPage} limit={PAGE_LIMIT} />
      ) : (
        <NoData msg="No contacts found." />
      )}
    </PageLayout>
  );
};

export default Contacts;
