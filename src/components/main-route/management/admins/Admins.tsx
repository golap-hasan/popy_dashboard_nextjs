"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import PageLayout from "@/layout/PageLayout";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import AdminTable from "./Admintable";
import { admins as seedAdmins } from "./adminData";
import { Button } from "@/components/ui/button";
import AddAdminModal from "./AddAdminModal";

const PAGE_LIMIT = 10;

const Admins = () => {
  const [adminList, setAdminList] = useState(seedAdmins);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoading = false;
  const isError = false;

  const filteredAdmins = useMemo(() => {
    if (!searchTerm.trim()) return adminList;

    const lowercasedTerm = searchTerm.toLowerCase();
    return adminList.filter(
      (admin) =>
        admin.name.toLowerCase().includes(lowercasedTerm) ||
        admin.email.toLowerCase().includes(lowercasedTerm) ||
        admin.phone.includes(searchTerm) ||
        admin.role.toLowerCase().includes(lowercasedTerm)
    );
  }, [adminList, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / PAGE_LIMIT));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * PAGE_LIMIT;
    return filteredAdmins.slice(start, start + PAGE_LIMIT);
  }, [filteredAdmins, currentPage]);

  const handleAddAdmin = (values: {
    name: string;
    email: string;
    phone: string;
    role: string;
    password: string;
  }) => {
    const newAdmin = {
      _id: crypto.randomUUID(),
      ...values,
      status: "pending",
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setAdminList((prev) => [newAdmin, ...prev]);
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <Suspense fallback={<TableSkeleton rows={10} />}>
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
          <Title title="ADMIN MANAGEMENT" length={adminList.length} />
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
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Admin
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <Error msg="Failed to load admins." />
        ) : filteredAdmins.length > 0 ? (
          <AdminTable data={paginatedAdmins} page={currentPage} limit={PAGE_LIMIT} />
        ) : (
          <NoData msg="No admins found." />
        )}
      </PageLayout>

      <AddAdminModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleAddAdmin}
      />
    </Suspense>
  );
};

export default Admins;

