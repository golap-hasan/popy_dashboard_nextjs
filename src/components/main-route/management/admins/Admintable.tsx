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
import type { Admin } from "@/redux/feature/admin/admin.types";
import AddAdminModal from "./UpdateAdminModal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
import { useDeleteAdminMutation } from "@/redux/feature/admin/adminApi";
import { ErrorToast } from "@/lib/utils";

const statusVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "blocked":
      return "destructive";
    default:
      return "outline";
  }
};

const roleVariant = (role: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
    case "manager":
      return "success";
    case "moderator":
    case "support":
      return "secondary";
    case "ops":
    case "media":
      return "outline";
    case "editor":
    case "reviewer":
      return "warning";
    default:
      return "outline";
  }
};

const AdminTable = ({
  data,
  page,
  limit,
}: {
  data: Admin[];
  page: number;
  limit: number;
}) => {
  const [deleteAdmin, { isLoading: deleting }] = useDeleteAdminMutation();

  const onConfirmDelete = async (id: string) => {
    try {
      await deleteAdmin(id).unwrap();
    } catch (error: unknown) {
      ErrorToast(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to delete admin."
      );
    }
  };

  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((admin: Admin, index: number) => {
            const derivedStatus =
              admin.status ?? (admin.isActive ? "active" : "inactive");

            return (
              <TableRow key={admin._id}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell className="min-w-[220px]">
                  <span className="font-medium whitespace-nowrap">
                    {admin.name}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {admin.email}
                </TableCell>
                <TableCell className="font-mono text-xs whitespace-nowrap">
                  {admin.phone}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={roleVariant(admin.role)}
                    className="capitalize"
                  >
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusVariant(derivedStatus)}
                    className="capitalize"
                  >
                    {derivedStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <AddAdminModal admin={admin} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="outline" className="ml-2">
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete admin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          remove the admin account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onConfirmDelete(admin._id)}
                          disabled={deleting}
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default AdminTable;
