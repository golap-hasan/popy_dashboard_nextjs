import MainLayout from "@/layout/MainLayout";

export default function MainRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}