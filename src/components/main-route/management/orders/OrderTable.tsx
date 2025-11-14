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
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { Order } from "@/redux/feature/order/order.type";
import OrderViewModal from "./OrderViewModal";

const paymentVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "refunded":
      return "refunded";
    default:
      return "outline";
  }
};

const deliveryVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "success";
    case "processing":
      return "processing";
    case "shipped":
      return "shipped";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderTable = ({ data, page, limit }: { data: Order[]; page: number; limit: number }) => {
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Books</TableHead>
            <TableHead>Total Qty</TableHead>
            <TableHead>Total Amount</TableHead>
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
                  <Badge variant={paymentVariant(order.paymentStatus)} className="capitalize">
                    {order.paymentStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={deliveryVariant(order.deliveryStatus)} className="capitalize">
                    {order.deliveryStatus}
                  </Badge>
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
  );
};

export default OrderTable;