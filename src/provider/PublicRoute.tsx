"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/redux/feature/auth/auth.type";

type PublicRouteProps = {
  children: ReactNode;
  redirectTo?: string; // Where to redirect authenticated users (defaults to '/')
};

const isTokenValid = (token?: string | null) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded) return false;
    const now = Math.floor(Date.now() / 1000);
    if (typeof decoded.exp === "number" && decoded.exp < now) return false;
    return true;
  } catch {
    return false;
  }
};

export default function PublicRoute({ children, redirectTo = "/" }: PublicRouteProps) {
  const router = useRouter();
  const token = typeof window === "undefined" ? null : localStorage.getItem("accessToken");
  const valid = isTokenValid(token);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (valid) {
      router.replace(redirectTo);
    }
  }, [valid, redirectTo, router]);

  if (valid) return null;
  return <>{children}</>;
}
