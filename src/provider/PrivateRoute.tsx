"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PrivateRouteProps = {
  children: ReactNode;
  fallback?: string; // fallback route when unauthorized (default: '/auth/login')
};

export default function PrivateRoute({ children, fallback = "/auth/login" }: PrivateRouteProps) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const hasToken = !!token; // Only check for token presence

    if (!hasToken) {
      router.replace(fallback);
      return;
    }

    setIsVerified(true);
  }, [router, fallback]);

  if (!isVerified) {
    // Render a stable placeholder during verification
    return <div aria-hidden className="w-full h-full" />;
  }
  return <>{children}</>;
}
