import type { Metadata } from "next";
import EditBookForm from "@/components/main-route/management/books/EditBookForm";

export const metadata: Metadata = {
  title: "Edit Book - Popy Dashboard",
  description: "Update an existing book in the catalog.",
};

type PageProps = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id, slug } = await params;
  return <EditBookForm id={id} slug={slug} />;
};

export default Page;