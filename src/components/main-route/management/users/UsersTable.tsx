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
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';

const UsersTable = ({ data, page, limit, onBlock }: any) => {
    return (
        <>
            <ScrollArea className="w-[calc(100vw-32px)] overflow-hidden overflow-x-auto md:w-full rounded-xl whitespace-nowrap">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>SN</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Company ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((user: any, index: any) => (
                            <TableRow key={user._id}>
                                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="border w-10 h-10">
                                            <AvatarImage src={user.profile_image || ''} alt={user.name} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone_number || 'Not Available Long'}</TableCell>
                                <TableCell className="font-mono text-xs">{user.company_id}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.status === 'active' ? 'default' :
                                                user.status === 'pending' ? 'warning' : 'destructive'
                                        }
                                    >
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        onClick={() => onBlock(user._id)}
                                        variant="outline" size="icon"
                                        className="text-red-500">
                                        <Ban className="h-5 w-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </>
    );
};

export default UsersTable;