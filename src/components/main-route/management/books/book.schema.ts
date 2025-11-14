import { z } from "zod";

export const bookFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." }),
  subtitle: z.string().optional(),
  author: z
    .string()
    .min(2, { message: "Author must be at least 2 characters." }),
  slug: z.string().min(2, { message: "Slug is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  quantity: z.string().min(1, { message: "Quantity is required." }),
  price: z.string().min(1, { message: "Price is required." }),
  originalPrice: z.string().optional(),
  rating: z.string().optional(),
  reviewsCount: z.string().optional(),
  tag: z.string().optional(),
  description: z.string().optional(),
  highlights: z.string().optional(),
  specs: z.string().optional(),
  aboutAuthorBio: z.string().optional(),
  aboutAuthorAchievements: z.string().optional(),
});

export const fileSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "Please upload a valid image file.",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Each image must be 5MB or less.",
  });

export const addBookFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  subtitle: z.string().optional(),
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  price: z.string().min(1, { message: "Price is required." }),
  originalPrice: z.string().optional(),
  tag: z.string().min(2, { message: "Tag must be at least 2 characters." }),
  coverImages: z
    .array(fileSchema)
    .min(1, { message: "At least one cover image is required." })
    .max(5, { message: "You can upload up to 5 images." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  highlights: z.string().min(10, { message: "Highlights must be at least 10 characters." }),
  specs: z.string().optional(),
});