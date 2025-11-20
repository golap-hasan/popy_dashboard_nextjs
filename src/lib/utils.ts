import clsx from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { format } from "date-fns";
import { imageUrl } from "@/redux/feature/baseApi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ErrorToast = (message: string) => {
  toast.error(message);
};

export const SuccessToast = (message: string) => {
  toast.success(message);
};

export const WarningToast = (message: string) => {
  toast.warning(message);
};

export const InfoToast = (message: string) => {
  toast.info(message);
};

// Get Initials
export const getInitials = (name: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "N";
  const second = parts[1]?.[0] || parts[0]?.[1] || "A";
  return (first + second).toUpperCase();
};

// Get Image URL
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  // If absolute URL, return as-is
  if (/^http?:\/\//i.test(imagePath)) return imagePath;
  return `${imageUrl}/${imagePath}`;
};

// Format Date 
export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'dd MMM yyyy');
};

// Time Ago
export const timeAgo = (createdAt: string) => {
  if (!createdAt) return ""
  const s = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  if (s < 60) return "Just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

  // Format date for display
  export const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };