import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, Admin } from "./auth.type";

const initialState: AuthState = {
  admin: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
    },

    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      if (action.payload) {
        localStorage.setItem("accessToken", action.payload);
      } else {
        localStorage.removeItem("accessToken");
      }
    },
  },
});

export const { setAdmin, setAccessToken } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;

// Export types for use in components
export type { AuthState, Admin };
