export interface LegalPageData {
  _id: string;
  type: string;
  content: string;
  createdAt: string;
  title: string;
  updatedAt: string;
}

export interface LegalPageResponse {
  success: boolean;
  message: string;
  data: LegalPageData;
}

export interface AddOrUpdateLegalPageRequest {
  type: string;
  data: {
    description?: string;
    content?: string;
    title?: string;
  };
}

export type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isReplied: boolean;
  createdAt: string;
};

export type ContactQueryParams = {
  searchTerm?: string;
  page?: number;
  limit?: number;
};

