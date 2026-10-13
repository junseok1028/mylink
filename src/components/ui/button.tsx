import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700 active:scale-98 shadow-sm",
      destructive: "bg-red-500 text-white hover:bg-red-600 active:scale-98 shadow-sm",
      outline: "border border-gray-200 bg-white text-gray-800 hover:bg-gray-100 active:scale-98",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-98",
      ghost: "text-gray-700 hover:bg-gray-100",
      link: "text-blue-600 underline-offset-4 hover:underline",
    }[variant]

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 px-3 text-xs rounded-lg",
      lg: "h-12 px-6 text-base",
      icon: "h-9 w-9",
    }[size]

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 rounded-xl cursor-pointer",
          variantStyles,
          sizeStyles,
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
