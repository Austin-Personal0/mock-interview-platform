"use client";

import { toast } from "sonner";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastNotificationProps {
  message: string;
  type?: ToastType;
  duration?: number;
  description?: string;
}

/**
 * Display a toast notification with modern styling
 * @param message - The title message to display
 * @param type - The type of notification (success, error, warning, info)
 * @param duration - Duration in milliseconds (default: 4000)
 * @param description - Optional description text
 */
export function showToast(
  message: string,
  type: ToastType = "info",
  duration: number = 4000,
  description?: string
): void {

  const descriptionClassName = 'text-white'
  const toastOptions = {
    duration,
    descriptionClassName : 'font-bold',
    style : {
      backgroundColor : type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'orange' : 'blue',
      color : 'white'
    }
  };

  switch (type) {
    case "success":
      toast.success(message, {
        ...toastOptions,
        description,
      });
      break;
    case "error":
      toast.error(message, {
        ...toastOptions,
        description,
      });
      break;
    case "warning":
      toast.warning(message, {
        ...toastOptions,
        description,
      });
      break;
    case "info":
    default:
      toast.info(message, {
        ...toastOptions,
        description,
      });
      break;
  }
}

/**
 * Promise-based toast for async operations
 * @param promise - The promise to handle
 * @param messages - Object with loading, success, and error messages
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  }
): void {
  toast.promise(promise, {
    loading: messages.loading,
    success: (data) => {
      if (typeof messages.success === "function") {
        return messages.success(data);
      }
      return messages.success;
    },
    error: (error) => {
      if (typeof messages.error === "function") {
        return messages.error(error);
      }
      return messages.error;
    },
    style: {
      backdropFilter: "blur(12px)",
    },
  });
}

/**
 * Reusable ToastNotification component
 * Note: This component doesn't render anything visible.
 * Use the `showToast` function to display notifications.
 * 
 * @example
 * ```tsx
 * import { showToast, toastPromise } from "@/components/ToastNotification";
 * 
 * // Simple toast
 * showToast("Operation successful!", "success");
 * showToast("Something went wrong", "error");
 * 
 * // With description
 * showToast("Profile updated", "success", 5000, "Your changes have been saved");
 * 
 * // Promise toast (for async operations)
 * toastPromise(fetchData(), {
 *   loading: "Loading data...",
 *   success: "Data loaded successfully!",
 *   error: "Failed to load data"
 * });
 * ```
 */
export function ToastNotification({
  message,
  type = "info",
  duration = 4000,
  description,
}: ToastNotificationProps) {
  // Auto-display toast when component mounts (for backward compatibility)
  if (typeof window !== "undefined") {
    showToast(message, type, duration, description);
  }

  return null;
}

export default ToastNotification;
