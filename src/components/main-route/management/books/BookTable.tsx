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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Pencil } from "lucide-react";

const formatPrice = (price : number) => `৳${Number(price).toLocaleString()}`;

const tagVariant = (tag : string) => {
  if (!tag) return "outline";
  const normalized = tag.toLowerCase();

  if (["new", "new edition"].includes(normalized)) return "success";
  if (["best seller", "hot"].includes(normalized)) return "warning";
  if (["practice", "focus series", "workbook", "recommended", "academic"].includes(normalized)) {
    return "secondary";
  }

  return "outline";
};

const statusVariant = (status : string) => {
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

const BookTable = ({ data, page, limit }: { data: any; page: number; limit: number }) => {
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Book</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((book : any, index : number) => (
            <TableRow key={book._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell className="min-w-[220px]">
                <div className="flex flex-col">
                  <span className="font-medium whitespace-nowrap">{book.title}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{book.author}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {book.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={tagVariant(book.tag)} className="capitalize">
                  {book.tag}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{formatPrice(book.price)}</TableCell>
              <TableCell>{book.stock}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(book.status)} className="capitalize">
                  {book.status?.replaceAll("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <Button variant="outline" size="icon">
                  <Pencil />
                </Button>
                <Button variant="default" size="icon">
                  <Eye />
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