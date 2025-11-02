import type { Metadata } from "next";
import Admins from "@/components/main-route/management/admins/Admins";

export const metadata: Metadata = {
    title: "Admins Management",
    description: "View and manage administrator users for the dashboard.",
};

const AdminPage = () => {
    return <Admins />;
};

export default AdminPage;