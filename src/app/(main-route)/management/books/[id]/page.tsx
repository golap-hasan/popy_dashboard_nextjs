import type { Metadata } from "next";
import EditBookForm from "@/components/main-route/management/books/EditBookForm";

export const metadata: Metadata = {
  title: "Edit Book",
  description: "Update an existing book in the catalog.",
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return <EditBookForm id={id} />;
};

export default Page;