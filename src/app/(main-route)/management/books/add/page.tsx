import AddBookForm from "@/components/main-route/management/books/AddBookForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Add New Book",
    description: "Add a new book to the catalog.",
};

const AddBookPage = () => {
    return <AddBookForm />;
};

export default AddBookPage;