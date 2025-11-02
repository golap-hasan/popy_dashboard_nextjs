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
import { formatDate } from "@/lib/utils";
import { Pencil } from "lucide-react";

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

const AdminTable = ({ data, page, limit }: { data: any; page: number; limit: number }) => {
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
            <TableHead>Last Active</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((admin: any, index: number) => (
            <TableRow key={admin._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell className="min-w-[220px]">
                <span className="font-medium whitespace-nowrap">{admin.name}</span>
              </TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">{admin.email}</TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">{admin.phone}</TableCell>
              <TableCell>
                <Badge variant={roleVariant(admin.role)} className="capitalize">
                  {admin.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(admin.status)} className="capitalize">
                  {admin.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(admin.lastActiveAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(admin.createdAt)}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="icon">
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

export default AdminTable;