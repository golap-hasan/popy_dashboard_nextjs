export interface Order {
  _id: string;
  user: {
    name: string;
    phone: string;
    email: string;
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