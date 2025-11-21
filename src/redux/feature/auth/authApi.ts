import { SuccessToast, ErrorToast } from "@/lib/utils";
import { setAccessToken, setAdmin } from "./authSlice";
import { baseApi } from "../baseApi";
import { jwtDecode } from "jwt-decode";
import { ApiErrorResponse, DecodedToken, LoginCredentials, LoginResponse } from "./auth.type";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ADMIN PROFILE
    getAdminProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["PROFILE"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(setAdmin(data.data));
          }
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "Failed to get admin profile.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),

    // UPDATE ADMIN PROFILE INFO
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update-user-data",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PROFILE"],
    }),

    // UPDATE PROFILE IMAGE
    updateProfileImage: builder.mutation({
      query: (data) => ({
        url: "/user/update-profile-photo",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PROFILE"],
    }),

    // CHANGE PASSWORD
    changePassword: builder.mutation({
      query: (data) => {
        return {
          url: "/user/change-password",
          method: "PATCH",
          body: data,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          SuccessToast(data?.message);
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "Failed to change password.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),

    // Login Endpoint (Mutation)
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/user/signin",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const accessToken: string | undefined = data?.data?.accessToken;
          const decoded = accessToken ? jwtDecode<DecodedToken>(accessToken) : null;

          if (decoded?.role === "ADMIN" || decoded?.role === "SUPER_ADMIN") {
            if (accessToken) {
              dispatch(setAccessToken(accessToken));
              // Extract admin data from JWT payload (exclude iat, exp)
              const adminData = {
                _id: decoded._id,
                name: decoded.name,
                address: decoded.address,
                phone: decoded.phone,
                email: decoded.email,
                image: decoded.image,
                role: decoded.role,
              };
              dispatch(setAdmin(adminData));
            }
            SuccessToast("Login successful!");
            window.location.href = "/";
          } else {
            ErrorToast("You are not authorized to login.");
            return;
          }
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "Login failed.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),

    // FORGET PASSWORD
    forgetPassword: builder.mutation({
      query: (email) => {
        return {
          url: "/user/forgot-password",
          method: "POST",
          body: email,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("FPT", data?.data?.token);
          SuccessToast(data?.message);
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "Failed to send new OTP.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),

    // OTP VERIFY FOR RESET PASSWORD
    verifyOTPForResetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/verify-forgot-password-otp",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== "undefined") {
            const token = data?.data?.resetPasswordToken as string | undefined;
            if (token) {
              localStorage.setItem("FPT", token);
            }
          }
          SuccessToast(data?.message);
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "OTP verification failed.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),

    // RESEND RESET OTP
    resendResetOTP: builder.mutation({
      query: (data) => ({
        url: "/user/send-forgot-password-otp-again",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          SuccessToast(data?.message);
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "Failed to send new OTP.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),

    // RESET PASSWORD
    resetPassword: builder.mutation({
      query: (data) => {
        return {
          url: "/user/reset-password",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          SuccessToast(data?.message || "Password reset successful!");
          if (typeof window !== "undefined") {
            localStorage.removeItem("FPT");
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 1000);
          }
        } catch (error) {
          const apiErr = (error as { error?: { data?: ApiErrorResponse } })?.error
            ?.data;
          const fallback = "Failed to reset password.";
          const msg = apiErr?.message || apiErr?.errorSources?.[0]?.message || fallback;
          ErrorToast(msg);
        }
      },
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUpdateProfileImageMutation,
  useLoginMutation,
  useForgetPasswordMutation,
  useVerifyOTPForResetPasswordMutation,
  useResendResetOTPMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
