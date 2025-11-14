"use client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Eye } from "lucide-react";
import { Pencil } from "lucide-react";
import type { Book } from "@/redux/feature/book/book.type";
import { getImageUrl, timeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formatPrice = (price: number) => `৳${Number(price).toLocaleString()}`;

const tagVariant = (tag: string) => {
  if (!tag) return "outline";
  const normalized = tag.toLowerCase();

  if (["new", "new edition"].includes(normalized)) return "success";
  if (["best seller", "hot"].includes(normalized)) return "warning";
  if (
    [
      "practice",
      "focus series",
      "workbook",
      "recommended",
      "academic",
    ].includes(normalized)
  ) {
    return "secondary";
  }

  return "outline";
};

const statusVariant = (status: string) => {
  switch (status) {
    case "in_stock":
      return "success";
    case "low_stock":
      return "warning";
    case "out_of_stock":
      return "destructive";
    default:
      return "outline";
  }
};

const BookTable = ({
  data,
  page,
  limit,
}: {
  data: Book[];
  page: number;
  limit: number;
}) => {
  const router = useRouter();
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Cover</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Active</TableHead> */}
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((book: Book, index: number) => (
            <TableRow key={book._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell>
                {book.coverImage ? (
                  <img
                    src={getImageUrl(book?.coverImage)}
                    alt={book.title}
                    className="h-12 w-9 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-9 bg-muted rounded" />
                )}
              </TableCell>
              <TableCell className="min-w-[220px]">
                <div className="flex flex-col">
                  <span className="font-medium whitespace-nowrap">
                    {book.title}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {book.author}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={tagVariant(book.tag as string)}
                  className="capitalize"
                >
                  {book.tag}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {typeof book.originalPrice === "number" && book.originalPrice > book.price ? (
                    <span className="text-muted-foreground line-through text-sm">
                      {formatPrice(book.originalPrice)}
                    </span>
                  ) : null}
                  <span>{formatPrice(book.price)}</span>
                </div>
              </TableCell>
              <TableCell>
                {typeof book.rating === "number" ? book.rating.toFixed(1) : "-"}
                {typeof book.reviewsCount === "number" ? ` (${book.reviewsCount})` : ""}
              </TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>
                <Badge
                  variant={statusVariant(
                    book.quantity === 0
                      ? "out_of_stock"
                      : book.quantity <= 50
                        ? "low_stock"
                        : "in_stock"
                  )}
                  className="capitalize"
                >
                  {(book.quantity === 0
                    ? "out_of_stock"
                    : book.quantity <= 50
                      ? "low_stock"
                      : "in_stock"
                  ).replaceAll("_", " ")}
                </Badge>
              </TableCell>
              {/* <TableCell>
                <Badge variant={book.isActive ? "success" : "destructive"}>
                  {book.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell> */}
              <TableCell>
                {book.createdAt ? timeAgo(book.createdAt) : "-"}
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button onClick={() => router.push(`/management/books/${book._id}`)} variant="outline" size="icon">
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default BookTable;
