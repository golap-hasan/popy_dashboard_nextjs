export type BookSpec = {
  label: string;
  value: string;
};

export type AboutAuthor = {
  bio: string;
  achievements: string[];
};

export type Book = {
  _id: string;
  title: string;
  subtitle?: string;
  author: string;
  slug: string;
  category: string; // category id
  quantity: number;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  tag?: string;
  coverImage?: string;
  description?: string;
  highlights?: string[];
  specs?: BookSpec[];
  aboutAuthor?: AboutAuthor;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type BookQueryParams = {
  page?: number;
  searchTerm?: string;
  // extend with filters as backend supports
  [k: string]: unknown;
};
