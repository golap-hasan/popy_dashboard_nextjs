/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";
import type { ApiListResponse } from "@/hooks/useSmartFetchHook";
import { Contact } from "./legal.type";

const legalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET LEGAL PAGES
    getLegalPage: builder.query({
      query: (type: string) => ({
        url: `/page/retrieve/${type}`,
        method: "GET",
      }),
      providesTags: ["LEGAL"],
    }),

    // GET CUSTOMER HELP (supports pagination and search)
    getCustomerHelp: builder.query<ApiListResponse<Contact>, { page?: number; limit?: number; searchTerm?: string }>({
      query: (args: any) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value) {
              params.append(key, value as string);
            }
          });
        }
        return {
          url: "/contact",
          method: "GET",
          params,
        };
      },
      providesTags: ["LEGAL"],
    }),

    // ADD OR UPDATE LEGAL PAGE
    addOrUpdateLegalPage: builder.mutation({
      query: (data: any) => ({
        url: `/page/create-or-update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LEGAL"],
    }),
  }),
});

export const {
  useGetLegalPageQuery,
  useGetCustomerHelpQuery,
  useAddOrUpdateLegalPageMutation,
} = legalApi;
