import { baseApi } from "../baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET DASHBOARD DATA
    getDashboardData: builder.query({
      query: () => ({
        url: "/user/meta-data",
        method: "GET",
      }),
      providesTags: ["DASHBOARD"],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
} = dashboardApi;
