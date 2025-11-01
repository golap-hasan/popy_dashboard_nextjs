import clsx from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"
import { format } from "date-fns";

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