import MainLayout from "@/layout/MainLayout";
import PrivateRoute from "@/provider/PrivateRoute";

export default function MainRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivateRoute>
      <MainLayout>{children}</MainLayout>
    </PrivateRoute>
  );
}
