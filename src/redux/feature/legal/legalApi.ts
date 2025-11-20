/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseApi } from "../baseApi";

const legalApi = baseApi.injectEndpoints({
  endpoints: (builder: any) => ({
    
    // GET LEGAL PAGES
    getLegalPage: builder.query({
      query: (type: string) => ({
        url: `/page/retrieve/${type}`,
        method: "GET",
      }),
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

export const { useGetLegalPageQuery, useAddOrUpdateLegalPageMutation } = legalApi;
