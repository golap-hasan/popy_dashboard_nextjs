import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import { setAccessToken, setAdmin } from "./auth/authSlice";

// export const baseUrl = "https://popy-book-apis.vercel.app/api/v1";
export const baseUrl = "http://10.10.20.41:6021/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseUrl,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState | undefined;
    const token = state?.auth.accessToken as string | null | undefined;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrap baseQuery to handle 401 globally
const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const status: number | string | undefined = result?.error?.status;
  if (status === 401 || status === 403) {
    // Determine request URL to avoid redirecting on login attempts
    const requestUrl = typeof args === "string" ? args : (args as FetchArgs)?.url;
    const isLoginEndpoint = typeof requestUrl === "string" && requestUrl.includes("/user/signin");
    const isOnLoginPage = typeof window !== "undefined" && window.location?.pathname?.startsWith("/auth/login");
    const isChangePasswordEndpoint = typeof requestUrl === "string" && requestUrl.includes("/user/change-password");
    const isOnChangePasswordPage = typeof window !== "undefined" && window.location?.pathname?.startsWith("/settings/profile");

    // Clear auth state
    api.dispatch(setAccessToken(null));
    api.dispatch(setAdmin(null));
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }

    // Only redirect to login if not already there and not during login request
    if (typeof window !== "undefined" && !isLoginEndpoint && !isOnLoginPage && !isChangePasswordEndpoint && !isOnChangePasswordPage) {
      window.location.href = "/auth/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,

  tagTypes: ["USER", "PROFILE", "LEGAL", "DASHBOARD", "COMPANY", "MENU", "ADMIN", "ORDER", "BOOK", "CATEGORY"],
  endpoints: () => ({}),
});
