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
import { Reply } from "lucide-react";
import { formatDate } from "@/lib/utils";

const typeVariant = (type: string) => {
  switch (type?.toLowerCase()) {
    case "support":
      return "success";
    case "sales":
      return "warning";
    case "general":
    default:
      return "secondary";
  }
};

const ContactTable = ({ data, page, limit }: { data: any; page: number; limit: number }) => {
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((contact: any, index: number) => (
            <TableRow key={contact._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell className="min-w-[220px]">
                <span className="font-medium whitespace-nowrap">{contact.name}</span>
              </TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">{contact.email}</TableCell>
              <TableCell className="font-mono text-xs whitespace-nowrap">{contact.phone}</TableCell>
              <TableCell>
                <Badge variant={typeVariant(contact.type)} className="capitalize">
                  {contact.type}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(contact.createdAt)}
              </TableCell>
              <TableCell className="flex gap-2 text-center">
                <Button variant="outline" size="icon">
                  <Reply />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ContactTable;