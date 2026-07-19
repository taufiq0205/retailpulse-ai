import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A5A40] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-[#5A5A40] hover:bg-[#6B6B4F] text-white border border-transparent shadow-sm",
    secondary: "bg-[#F1EFEC] hover:bg-[#E6E2DE] text-[#4A443F] border border-transparent",
    outline: "border border-[#E6E2DE] bg-white hover:bg-[#FAF9F7] text-[#4A443F] shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-transparent shadow-sm",
    ghost: "hover:bg-[#FAF9F7] text-[#7A7169] hover:text-[#2C2926]",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
