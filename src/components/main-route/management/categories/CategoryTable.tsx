import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/redux/feature/category/category.type";
import EditCategoryModal from "./EditCategoryModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useDeleteCategoryMutation } from "@/redux/feature/category/categoryApi";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { Loader } from "lucide-react";

const CategoryTable = ({
  data,
  page,
  limit,
}: {
  data: Category[];
  page: number;
  limit: number;
}) => {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      SuccessToast("Category deleted successfully!");
    } catch (error: unknown) {
      ErrorToast((error as { data?: { message?: string } })?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center rounded-xl">
          <Loader className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((category: Category, index: number) => (
            <TableRow key={category._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell className="min-w-[220px]">
                <span className="font-medium whitespace-nowrap">
                  {category.name}
                </span>
              </TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">
                {category.slug}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(category.createdAt)}
              </TableCell>
              <TableCell className="flex gap-2 justify-center">
                <EditCategoryModal category={category} />
                {/* Delete Category */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the category "{category.name}" and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCategory(category._id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
    </div>
  );
};

export default CategoryTable;
