import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import { setAccessToken, setAdmin } from "./auth/authSlice";

// export const baseUrl = "https://popy-book-apis.vercel.app/api/v1";
export const baseUrl = "http://10.10.20.41:6021/api/v1";
export const imageUrl = "http://10.10.20.41:6021";

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
    // Clear auth state
    api.dispatch(setAccessToken(null));
    api.dispatch(setAdmin(null));
    localStorage.removeItem("accessToken");
    // Redirect to login
    if (typeof window !== "undefined") {
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
