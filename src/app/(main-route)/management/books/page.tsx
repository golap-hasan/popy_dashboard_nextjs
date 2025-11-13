import type { Metadata } from "next";
import Books from "@/components/main-route/management/books/Books";

export const metadata: Metadata = {
  title: "Books Management",
  description:
    "Browse and manage the catalog of books available in the system.",
};

const BooksPage = () => {
  return <Books />;
};

export default BooksPage;
