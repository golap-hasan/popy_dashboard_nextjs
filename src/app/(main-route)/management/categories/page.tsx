import type { Metadata } from "next";
import Categories from "@/components/main-route/management/categproes/Categories";

export const metadata: Metadata = {
    title: "Categories Management",
    description: "Organize and maintain product categories showcased in the catalog.",
};

const CategoryPage = () => {
    return <Categories />;
};

export default CategoryPage;