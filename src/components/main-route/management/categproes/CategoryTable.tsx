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
import { Eye, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";


const visibilityVariant = (visibility: string) => {
  switch (visibility) {
    case "public":
      return "success";
    case "internal":
      return "secondary";
    case "hidden":
      return "outline";
    default:
      return "outline";
  }
};


const CategoryTable = ({ data, page, limit }: { data: any; page: number; limit: number }) => {
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Books</TableHead>
            {/* <TableHead>Visibility</TableHead> */}
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((category: any, index: number) => (
            <TableRow key={category._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell className="min-w-[220px]">
                <span className="font-medium whitespace-nowrap">{category.name}</span>
              </TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">{category.slug}</TableCell>
             
              <TableCell className="font-medium">{category.bookCount}</TableCell>
              {/* <TableCell>
                <Badge variant={visibilityVariant(category.visibility)} className="capitalize">
                  {category.visibility}
                </Badge>
              </TableCell> */}
              <TableCell className="whitespace-nowrap">
                {formatDate(category.createdAt)}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default CategoryTable;