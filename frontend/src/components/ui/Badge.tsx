import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "secondary" | "neutral" | string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "neutral",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border";

  const variants: Record<string, string> = {
    success: "bg-[#F1EFEC] text-[#5A5A40] border-[#E6E2DE]",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-600 border-red-100",
    secondary: "bg-[#FAF9F7] text-[#7A7169] border-[#E6E2DE]",
    neutral: "bg-[#F1EFEC] text-[#4A443F] border-transparent",
  };

  const currentVariant = variants[variant] || variants.neutral;

  return (
    <span className={cn(baseStyles, currentVariant, className)} {...props}>
      {children}
    </span>
  );
};
