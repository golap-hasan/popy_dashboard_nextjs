export interface Order {
  _id: string;
  user: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  deliveryCharge: number;
  finalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  books: {
    quantity: number;
    unitPrice: number;
    book: {
      title: string;
      coverImage: string;
      slug: string;
    };
  }[];
}

export interface OrderQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  [k: string]: unknown;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Order[];
}

export interface ApiError {
  success: false;
  message: string;
  errorSources?: {
    path: string;
    message: string;
  }[];
  stack?: string | null;
}

export interface ApiErrorData {
  data: {
    success: false;
    message: string;
  };
}
