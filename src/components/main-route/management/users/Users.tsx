"use client"
import { Search } from "lucide-react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import PageLayout from "@/layout/PageLayout";
import NoData from "@/common/NoData";

import { users } from "./userData";
import UsersTable from "./UsersTable";
import ConfirmationModal from "@/common/ConfirmationModal";
import { useState } from "react";

const PAGE_SIZE = 10;

const Users = () => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const currentPage = 1;
    const totalPages = 2;

    return (
        <div>
            <PageLayout
                pagination={
                    totalPages > 1 && (
                        <div className="mt-4">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={() => { /* static preview */ }}
                            />
                        </div>
                    )
                }
            >
                <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <Title title="Users" />
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search users"
                            className="w-full pl-10 md:w-64"
                            value=""
                            readOnly
                        />
                    </div>
                </div>

                {users.length > 0 ? (
                    <UsersTable
                        data={users}
                        page={currentPage}
                        limit={PAGE_SIZE}
                        onBlock={() => { setConfirmOpen(true); }}
                        onActivate={() => { /* static preview */ }}
                    />
                ) : (
                    <NoData msg="No users found." />
                )}
            </PageLayout>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Confirm Block"
                description="Are you sure you want to block this user?"
                confirmText="Block"
                onConfirm={() => { 
                }}
                // loading={banLoading}
                // onConfirm={() => handleToggleBanUser(selectedUser)}
            />
        </div>
    );
};

export default Users;
