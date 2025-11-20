"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Pencil } from "lucide-react";
import type { Admin } from "@/redux/feature/admin/admin.types";
import { useUpdateAdminMutation } from "@/redux/feature/admin/adminApi";
import { ErrorToast, SuccessToast } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

interface AddAdminModalProps {
  admin: Admin;
}

const AddAdminModal = ({ admin }: AddAdminModalProps) => {
  const [open, setOpen] = useState(false);
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin.name ?? "",
      email: admin.email ?? "",
      password: "",
    },
  });

  const handleOpenChange = (dialogOpen: boolean) => {
    setOpen(dialogOpen);
    if (!dialogOpen) {
      form.reset({
        name: admin.name ?? "",
        email: admin.email ?? "",
        password: "",
      });
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateAdmin({
        id: admin._id,
        data: values,
      }).unwrap();
      SuccessToast("Update Successfully");
      setOpen(false);
    } catch (error) {
      ErrorToast((error as { data?: { message?: string } })?.data?.message || "Failed to update admin.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Update admin">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Admin</DialogTitle>
          <DialogDescription>
            Update admin credentials and basic information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a secure password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button loading={isLoading} type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Admin"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminModal;