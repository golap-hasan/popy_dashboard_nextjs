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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Eye } from 'lucide-react';
import { User } from '@/redux/feature/user/user.type';

interface UsersTableProps {
  data: User[];
  page: number;
  limit: number;
}

const UsersTable = ({ data, page, limit }: UsersTableProps) => {
    return (
        <>
            <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SN</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Role</TableHead>
                            {/* <TableHead className="text-center">Action</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((user: User, index: number) => (
                            <TableRow key={user._id}>
                                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="border w-10 h-10">
                                            <AvatarImage src={user.image || ''} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell className="max-w-[200px] truncate" title={user.address}>
                                    {user.address}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.isActive ? 'default' : 'destructive'
                                        }
                                    >
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                {/* <TableCell className="text-center">
                                    <Button
                                        variant="outline" size="icon">
                                        <Eye />
                                    </Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </>
    );
};

export default UsersTable;