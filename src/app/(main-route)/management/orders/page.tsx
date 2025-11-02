import type { Metadata } from "next";
import Orders from '@/components/main-route/management/orders/Orders';

export const metadata: Metadata = {
    title: "Orders Management",
    description: "View and manage orders placed by customers.",
};

const OrderPage = () => {
    return (
        <Orders />
    );
};

export default OrderPage;