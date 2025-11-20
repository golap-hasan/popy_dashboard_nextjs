export type AdminQueryParams = {
  page?: number;
  searchTerm?: string;
};

export type Admin = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  status?: string;
  lastActiveAt?: string;
  createdAt?: string;
};

