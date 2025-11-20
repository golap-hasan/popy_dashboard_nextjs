import { baseApi } from "../baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ADMIN
    getAllAdmin: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          Object.entries(args).forEach(([key, value]) => {
            if (value) {
              params.append(key, value as string);
            }
          });
        }
        return {
          url: "/admin",
          method: "GET",
          params,
        };
      },
      providesTags: ["ADMIN"],
    }),

    // ADD ADMIN
    addAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ADMIN"],
    }),

    // UPDATE ADMIN
    updateAdmin: builder.mutation({
      query: ({ data, id }) => ({
        url: `/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ADMIN"],
    }),

    // DELETE ADMIN
    // deleteAdmin: builder.mutation({
    //   query: (id) => ({
    //     url: `/admin/delete-admin/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["ADMIN"],
    // }),
  }),
});

export const {
  useGetAllAdminQuery,
  useAddAdminMutation,
  useUpdateAdminMutation,
  // useDeleteAdminMutation,
} = adminApi;
