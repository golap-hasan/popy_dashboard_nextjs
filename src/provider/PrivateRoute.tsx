"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/redux/feature/auth/auth.type";

type PrivateRouteProps = {
  children: ReactNode;
  roles?: string[]; // Optional role-based access control
  fallback?: string; // fallback route when unauthorized (default: '/auth/login')
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

export default function PrivateRoute({ children, roles, fallback = "/auth/login" }: PrivateRouteProps) {
  const router = useRouter();

  // Read token from localStorage (client only)
  const token = typeof window === "undefined" ? null : localStorage.getItem("accessToken");
  const valid = isTokenValid(token);

  let roleOk = true;
  if (roles && roles.length > 0 && token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userRole = decoded?.role;
      roleOk = !!userRole && roles.includes(userRole);
    } catch {
      roleOk = false;
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!valid) {
      router.replace(fallback);
      return;
    }
    if (!roleOk) {
      router.replace("/");
      return;
    }
  }, [valid, roleOk, router, fallback]);

  if (!valid || !roleOk) return null;
  return <>{children}</>;
}
