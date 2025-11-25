"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PublicRouteProps = {
  children: ReactNode;
  redirectTo?: string; // Where to redirect authenticated users (defaults to '/')
};

export default function PublicRoute({ children, redirectTo = "/" }: PublicRouteProps) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false); // To handle client-side only logic

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const hasToken = !!token; // Only check for token presence

    if (hasToken) {
      router.replace(redirectTo);
      return;
    }

    setIsVerified(true);
  }, [router, redirectTo]);

  if (!isVerified) {
    // Render a stable placeholder during verification
    return null; // Or a loading spinner/placeholder if desired
  }
  return <>{children}</>;
}
