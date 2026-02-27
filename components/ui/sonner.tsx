"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group [&]:space-y-3"
      icons={{
        success: <CircleCheckIcon className="size-5 text-green-400 drop-shadow-lg" />,
        info: <InfoIcon className="size-5 text-blue-400 drop-shadow-lg" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-400 drop-shadow-lg" />,
        error: <OctagonXIcon className="size-5 text-red-400 drop-shadow-lg" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={{
        "--normal-bg": theme === "dark" ? "rgba(15, 23, 42, 0.88)" : "rgba(255, 255, 255, 0.92)",
        "--normal-text": theme === "dark" ? "#ffffff" : "#0f172a",
        "--normal-border": theme === "dark" ? "rgba(71, 85, 105, 0.4)" : "rgba(203, 213, 225, 0.4)",
        "--border-radius": "14px",
        "--normal-padding": "16px 18px",
      } as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: "backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl",
          title: "font-semibold text-base tracking-wide text-white dark:text-white text-slate-900",

          actionButton: "bg-primary text-primary-foreground font-medium px-4 py-1.5 rounded-lg transition-colors hover:opacity-90",
          cancelButton: "bg-muted/80 text-muted-foreground font-medium px-4 py-1.5 rounded-lg transition-colors hover:bg-muted",
        },
      }}
      position="top-right"
      {...props}
    />
  )
}

export { Toaster }
