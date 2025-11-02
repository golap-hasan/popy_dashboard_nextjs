import type { Metadata } from "next";
import Users from "@/components/main-route/management/users/Users";

export const metadata: Metadata = {
    title: "Users Management",
    description: "View and manage user accounts in the system.",
};

const UserPage = () => {
    return (
        <Users />
    );
};

export default UserPage;