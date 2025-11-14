import { baseApi } from "../baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL ORDER
    getAllOrder: builder.query({
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
          url: "/order",
          method: "GET",
          params,
        };
      },
      providesTags: ["ORDER"],
    }),

    // GET SINGLE ORDER
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/order/details/${id}`,
        method: "GET",
      }),
      providesTags: ["ORDER"],
    }),

    //====================================================================================

    // UPDATE ORDER STATUS
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["ORDER"],
    }),

    // UPDATE ORDER PAYMENT STATUS
    updateOrderPaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/order/${id}/payment-status`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: ["ORDER"],
    }),

    // UPDATE ORDER DELIVERY STATUS
    updateOrderDeliveryStatus: builder.mutation({
      query: ({ id, deliveryStatus }) => ({
        url: `/order/${id}/delivery-status`,
        method: "PATCH",
        body: { deliveryStatus },
      }),
      invalidatesTags: ["ORDER"],
    }),
  }),
});

export const {
  useGetAllOrderQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderPaymentStatusMutation,
  useUpdateOrderDeliveryStatusMutation,
  useGetSingleOrderQuery,
} = orderApi;
