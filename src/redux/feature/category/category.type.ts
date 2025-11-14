export type Category = {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryQueryParams = {
  page?: number;
  searchTerm?: string;
  [k: string]: unknown;
};