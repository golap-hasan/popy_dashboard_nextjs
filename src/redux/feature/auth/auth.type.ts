// Auth-related types

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type DecodedToken = {
  _id?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  image?: string;
  role?: "ADMIN" | "USER" | string;
  iat?: number;
  exp?: number;
};

// Common API error types for auth endpoints
export type ApiErrorSource = {
  path: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorSources: ApiErrorSource[];
  stack: string | null;
};

// Auth state types for Redux slice
export type AuthState = {
  admin: Admin | null;
  accessToken: string | null;
};

export type Admin = {
  _id?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  image?: string;
  role?: "ADMIN" | "USER" | string;
};
