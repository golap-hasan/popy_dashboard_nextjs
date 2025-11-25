import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/redux/feature/auth/auth.type";

export const getRole = () => {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const decoded = accessToken ? jwtDecode<DecodedToken>(accessToken) : null;
//   const adminRole = decoded?.role;
  return decoded?.role || null;
};
