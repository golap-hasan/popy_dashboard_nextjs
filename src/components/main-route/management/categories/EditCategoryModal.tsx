"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateCategoryMutation } from "@/redux/feature/category/categoryApi";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { Pencil } from "lucide-react";
import type { Category } from "@/redux/feature/category/category.type";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(60, { message: "Keep the name within 60 characters." }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters." })
    .max(100, { message: "Keep the slug within 100 characters." })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens." }),
});

interface EditCategoryModalProps {
  category: Category;
}

const EditCategoryModal = ({ category }: EditCategoryModalProps) => {
  const [open, setOpen] = useState(false);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Pre-fill form when category changes
  useEffect(() => {
    form.reset({
      name: category.name,
      slug: category.slug,
    });
  }, [category, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateCategory({ id: category._id, name: values.name, slug: values.slug }).unwrap();
      SuccessToast("Category updated successfully!");
      setOpen(false); // Close modal on success
    } catch (error: unknown) {
      ErrorToast((error as { data?: { message?: string } })?.data?.message || "Failed to update category.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>Update the category name and slug.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., HSC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., hsc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-between">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button loading={isLoading} type="submit" disabled={isLoading}>
                Update category
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
