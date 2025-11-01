
import { BookOpen, DollarSign, ShoppingCart, Users } from "lucide-react";

const StatCard = ({ icon, title, value, containerClassName, color }) => (
    <div className={`p-6 rounded-lg bg-sidebar ${containerClassName}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className={`${color} p-4 rounded-full`}>
                {icon}
            </div>
        </div>
    </div>
);

const DashboardStats = ({ data: stats }) => {
    const statsData = [
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Total Books",
            value: stats?.totalBooks?.toLocaleString() ?? '0',
            containerClassName: "bg-card",
            color: "bg-violet-500/90 dark:bg-violet-700/80",
        },
        {
            icon: <ShoppingCart className="h-6 w-6" />,
            title: "Total Orders",
            value: stats?.totalOrders?.toLocaleString() ?? '0',
            containerClassName: "bg-card",
            color: "bg-blue-500/90 dark:bg-blue-700/80",
        },
        {
            icon: <DollarSign className="h-6 w-6" />,
            title: "Total Revenue",
            value: stats?.totalRevenue ? `৳${stats.totalRevenue.toLocaleString()}` : '৳0',
            containerClassName: "bg-card",
            color: "bg-emerald-500/90 dark:bg-emerald-700/80",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Active Customers",
            value: stats?.activeCustomers?.toLocaleString() ?? '0',
            containerClassName: "bg-card",
            color: "bg-amber-500/90 dark:bg-amber-700/80",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
