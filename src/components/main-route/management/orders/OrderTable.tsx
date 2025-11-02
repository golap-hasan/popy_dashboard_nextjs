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
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Pencil } from "lucide-react";

const paymentVariant = (status: string) => {
  switch (status) {
    case "paid":
      return "success";
    case "refunded":
      return "refunded";
    case "unpaid":
    case "pending_refund":
      return "warning";
    default:
      return "outline";
  }
};

const fulfilmentVariant = (status: string) => {
  switch (status) {
    case "delivered":
      return "success";
    case "shipped":
      return "shipped";
    case "processing":
      return "processing";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderTable = ({ data, page, limit, onBlock }: { data: any; page: number; limit: number; onBlock: (id: string) => void }) => {
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Fulfilment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((order: any, index: number) => {
            const total = order.book.unitPrice * order.quantity;
            return (
              <TableRow key={order._id}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="border w-10 h-10">
                      <AvatarImage src="" alt={order.customer.name} />
                      <AvatarFallback>{getInitials(order.customer.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium whitespace-nowrap">{order.customer.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{order.customer.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="min-w-[220px]">
                  <div className="flex flex-col">
                    <span className="font-medium">{order.book.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">{order.book.sku}</span>
                  </div>
                </TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>৳{total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={paymentVariant(order.paymentStatus)} className="capitalize">
                    {order.paymentStatus.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={fulfilmentVariant(order.fulfilmentStatus)} className="capitalize">
                    {order.fulfilmentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    onClick={() => onBlock(order._id)}
                    variant="outline"
                    size="icon"
                    // onClick={() => onUpdateStatus(order)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    // onClick={() => onView(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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