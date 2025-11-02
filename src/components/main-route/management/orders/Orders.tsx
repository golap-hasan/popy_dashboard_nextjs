"use client"
import { Suspense } from "react";
import Title from "@/components/ui/Title";
import { Input } from "@/components/ui/input";
import CustomPagination from "@/common/CustomPagination";
import { Search } from "lucide-react";
import NoData from "@/common/NoData";
import Error from "@/common/Error";
import { orders } from "./orderData";
import PageLayout from "@/layout/PageLayout";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import OrderTable from "./OrderTable";
// import ConfirmationModal from "@/common/ConfirmationModal";

const Orders = () => {
    // const [confirmOpen, setConfirmOpen] = useState(false); 
    
    const searchTerm = "";
    const totalPages = 2;
    const currentPage = 1;
    const setSearchTerm = () => {};
    const setCurrentPage = () => {};
    const ordersLoading = false;
    const ordersError = false;
    const page = 1;

    return (
        <Suspense
            fallback={
                <TableSkeleton />
            }
        >
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
                {/* Title and Search */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start justify-between mb-4">
                    <Title title="ORDERS MANAGEMENT" length={orders.length} />
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search orders"
                            className="pl-10 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm()}
                        />
                    </div>
                </div>
                {/* Table */}
                {ordersLoading ? (
                    <TableSkeleton />
                ) : ordersError ? (
                    <Error msg="Error loading orders" />
                ) : orders?.length > 0 ? (
                    <OrderTable
                        data={orders}
                        page={page}
                        limit={10}
                        onBlock={() => {
                            // setConfirmOpen(true);
                            // setSelectedUser(user);
                        }}
                    />
                ) : (
                    <NoData msg=    "No orders found." />
                )}
            </PageLayout>

            {/* Confirmation Modal */}
            {/* <ConfirmationModal
                isOpen={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Confirm Block"
                description="Are you sure you want to block this user?"
                confirmText="Block"
                onConfirm={() => { }}
                loading={banLoading}
                loading={banLoading}
                onConfirm={() => handleToggleBanUser(selectedUser)}
            /> */}
        </Suspense>
    );
};

export default Orders;
