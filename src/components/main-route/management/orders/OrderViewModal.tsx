import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MapPin, CreditCard, Truck, Phone, Mail } from "lucide-react";
import { Order } from "@/redux/feature/order/order.type";
import { getInitials } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const OrderViewModal = ({ order }: { order: Order }) => {
  const [open, setOpen] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] p-0" showCloseButton={false}>
        <ScrollArea className="h-[80vh] sm:h-[70vh] md:h-auto overflow-hidden">
          <div className="min-h-full rounded-xl overflow-hidden">
            {/* Header */}
            <div className="border-b bg-muted/40">
              <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                <div className="flex flex-col gap-3 sm:gap-0">
                  {/* Mobile: stacked layout */}
                  <div className="flex items-center justify-between sm:hidden">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Eye className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-foreground">Order Details</h2>
                        <p className="text-xs text-muted-foreground">Customer & items summary</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs px-2 py-1">
                      #{order._id.slice(-8)}
                    </Badge>
                  </div>

                  {/* Desktop: horizontal layout */}
                  <DialogTitle className="hidden sm:flex sm:items-center justify-between gap-4 text-xl md:text-2xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-base md:text-lg">Order details</span>
                        <span className="block text-xs text-muted-foreground">Customer, items and payment summary</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs md:text-sm px-3 py-1">
                      #{order._id.slice(-8)}
                    </Badge>
                  </DialogTitle>
                </div>
              </DialogHeader>
            </div>

            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6">
              {/* Status row - responsive grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg sm:rounded-xl border bg-background/80 p-3 sm:p-4 shadow-sm flex items-center gap-2 sm:gap-3">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Payment status</p>
                    <Badge
                      variant={paymentVariant(order.paymentStatus)}
                      className="capitalize text-[10px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5"
                    >
                      {order.paymentStatus.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg sm:rounded-xl border bg-background/80 p-3 sm:p-4 shadow-sm flex items-center gap-2 sm:gap-3">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Delivery status</p>
                    <Badge
                      variant={deliveryVariant(order.deliveryStatus)}
                      className="capitalize text-[10px] sm:text-xs px-1.5 py-0 sm:px-2 sm:py-0.5"
                    >
                      {order.deliveryStatus}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg sm:rounded-xl border bg-background/80 p-3 sm:p-4 shadow-sm flex items-center gap-2 sm:gap-3 col-span-1 sm:col-span-2 lg:col-span-1">
                  <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Payment method</p>
                    <p className="text-xs sm:text-sm font-semibold">{order.paymentMethod === "COD" ? "Cash on delivery" : "Online"}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
                {/* Left column: customer + books */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Customer card */}
                  <div className="rounded-xl sm:rounded-2xl border bg-background/90 p-3 sm:p-5 shadow-sm">
                    <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground">
                      <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">
                        <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </span>
                      Customer information
                    </h3>
                    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border self-center sm:self-start">
                        <AvatarImage src="" alt={order.user.name} />
                        <AvatarFallback className="text-sm sm:text-lg font-semibold">
                          {getInitials(order.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <p className="text-sm sm:text-base font-semibold">{order.user.name}</p>
                        <div className="grid gap-2 text-[10px] sm:text-xs md:text-sm grid-cols-1 sm:grid-cols-2">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{order.user.email}</span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{order.user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ordered books card */}
                  <div className="rounded-xl sm:rounded-2xl border bg-background/90 p-3 sm:p-5 shadow-sm">
                    <h3 className="mb-3 sm:mb-4 flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground">
                      <span className="flex items-center gap-1.5 sm:gap-2">
                        <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">
                          📚
                        </span>
                        Ordered books
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{order.books.length} item{order.books.length > 1 ? "s" : ""}</span>
                    </h3>

                    <div className="space-y-2 sm:space-y-3">
                      {order.books.map((bookItem, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 sm:gap-4 rounded-lg sm:rounded-xl border bg-muted/40 p-2.5 sm:p-3 md:p-4"
                        >
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border bg-background shrink-0">
                            <AvatarImage
                              src={bookItem.book.coverImage}
                              alt={bookItem.book.title}
                            />
                            <AvatarFallback className="text-xs sm:text-sm">📖</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-semibold sm:text-base">
                              {bookItem.book.title}
                            </p>
                            <p className="mt-0.5 text-[9px] sm:text-[11px] md:text-xs font-mono text-muted-foreground">
                              {bookItem.book.slug}
                            </p>
                          </div>
                          <div className="text-right space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs md:text-sm shrink-0">
                            <p className="text-muted-foreground">৳{bookItem.unitPrice.toLocaleString()} × {bookItem.quantity}</p>
                            <p className="font-semibold">
                              ৳{(bookItem.unitPrice * bookItem.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column: address + summary */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Shipping address card */}
                  <div className="rounded-xl sm:rounded-2xl border bg-background/90 p-3 sm:p-5 shadow-sm">
                    <h3 className="mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground">
                      <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">
                        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </span>
                      Shipping address
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground">
                      {order.shippingAddress}
                    </p>
                  </div>

                  {/* Order summary card */}
                  <div className="rounded-xl sm:rounded-2xl border bg-background/90 p-3 sm:p-5 shadow-sm">
                    <h3 className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground">
                      <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">
                        <CreditCard className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </span>
                      Order summary
                    </h3>

                    <div className="space-y-2 sm:space-y-3 text-[11px] sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Subtotal ({order.books.length} book{order.books.length > 1 ? "s" : ""})
                        </span>
                        <span className="font-semibold">
                          ৳
                          {order.books
                            .reduce(
                              (sum, book) => sum + book.unitPrice * book.quantity,
                              0
                            )
                            .toLocaleString()}
                        </span>
                      </div>

                      {order.deliveryCharge > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Delivery charge</span>
                          <span className="font-semibold">
                            ৳{order.deliveryCharge.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <Separator className="my-1.5 sm:my-2" />

                      <div className="flex items-center justify-between rounded-lg sm:rounded-xl bg-primary/5 px-2 sm:px-3 py-2 sm:py-3">
                        <span className="text-xs sm:text-sm font-semibold">Total amount</span>
                        <span className="text-sm sm:text-lg font-bold text-primary">
                          ৳{order.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewModal;
