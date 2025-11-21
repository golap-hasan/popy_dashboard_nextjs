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
import { formatDateForDisplay } from "@/lib/utils";
import { Contact } from "@/redux/feature/legal/legal.type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const truncate = (text: string, max = 40) =>
  text?.length > max ? text.slice(0, max) + "…" : text;

const ContactTable = ({
  data,
  page,
  limit,
}: {
  data: Contact[];
  page: number;
  limit: number;
}) => {
  return (
    <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            {/* <TableHead>Replied</TableHead> */}
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((contact: Contact, index: number) => (
            <TableRow key={contact._id}>
              <TableCell>{(page - 1) * limit + index + 1}</TableCell>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{contact.subject}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block">
                        {truncate(contact.message, 40)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[320px] whitespace-pre-wrap wrap-break-words">
                      {contact.message}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              {/* <TableCell className="whitespace-nowrap">{contact.isReplied ? "Yes" : "No"}</TableCell> */}
              <TableCell className="whitespace-nowrap">
                {formatDateForDisplay(contact.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ContactTable;
