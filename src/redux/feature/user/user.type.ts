export interface User {
  _id: string;
  name: string;
  address: string;
  phone: string;
  image?: string;
  email: string;
  isVerifiedByOTP: boolean;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  passwordChangedAt?: string;
}

export interface UserQueryParams extends Record<string, unknown> {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface UserResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: User[];
}