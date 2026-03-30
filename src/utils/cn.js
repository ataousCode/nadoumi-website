import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join Tailwind CSS class names
 * and merge conflicting styles using tailwind-merge.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
