"use client"
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorToast, SuccessToast, getInitials } from "@/lib/utils";
import { Order } from "@/redux/feature/order/order.type";
import OrderViewModal from "./OrderViewModal";
import {
  useUpdateOrderStatusMutation,
  useUpdateOrderPaymentStatusMutation,
  useUpdateOrderDeliveryStatusMutation,
} from "@/redux/feature/order/orderApi";
import { Loader } from "lucide-react";

const OrderTable = ({ data, page, limit }: { data: Order[]; page: number; limit: number }) => {
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [updateOrderPaymentStatus, { isLoading: isUpdatingPaymentStatus }] = useUpdateOrderPaymentStatusMutation();
  const [updateOrderDeliveryStatus, { isLoading: isUpdatingDeliveryStatus }] = useUpdateOrderDeliveryStatusMutation();

  const handleStatusChange = async (orderId: string, field: keyof Order, value: string) => {
    try {
      let res: { message?: string } | undefined;
      if (field === 'status') {
        res = await updateOrderStatus({ id: orderId, status: value }).unwrap();
      } else if (field === 'paymentStatus') {
        res = await updateOrderPaymentStatus({ id: orderId, paymentStatus: value }).unwrap();
      } else if (field === 'deliveryStatus') {
        res = await updateOrderDeliveryStatus({ id: orderId, deliveryStatus: value }).unwrap();
      }
      SuccessToast(res?.message || "Status updated successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || "Failed to update status";
      ErrorToast(msg);
    }
  };

  const isLoading = isUpdatingStatus || isUpdatingPaymentStatus || isUpdatingDeliveryStatus;

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-xl">
          <Loader className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SN</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Books</TableHead>
              <TableHead>Total Qty</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((order: Order, index: number) => {
              const totalQuantity = order.books.reduce((sum, book) => sum + book.quantity, 0);
              const totalAmount = order.finalAmount;

              return (
                <TableRow key={order._id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="border w-10 h-10">
                        <AvatarImage src="" alt={order.user.name} />
                        <AvatarFallback>{getInitials(order.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium whitespace-nowrap">{order.user.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{order.user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[220px]">
                    <div className="flex flex-col gap-1">
                      {order.books.map((bookItem, bookIndex) => (
                        <div key={bookIndex} className="flex flex-col">
                          <span className="font-medium text-sm">{bookItem.book.title}</span>
                          <span className="text-xs text-muted-foreground">
                            ৳{bookItem.unitPrice} × {bookItem.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{totalQuantity}</TableCell>
                  <TableCell>৳{totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order._id, 'status', value)}
                    >
                      <SelectTrigger className="w-fit border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.paymentStatus}
                      onValueChange={(value) => handleStatusChange(order._id, 'paymentStatus', value)}
                    >
                      <SelectTrigger className="w-fit border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.deliveryStatus}
                      onValueChange={(value) => handleStatusChange(order._id, 'deliveryStatus', value)}
                    >
                      <SelectTrigger className="w-fit border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <OrderViewModal order={order} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default OrderTable;