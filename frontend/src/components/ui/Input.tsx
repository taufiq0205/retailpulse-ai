import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-[#7A7169] uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-[#E6E2DE] bg-white px-3 py-2 text-sm text-[#2C2926] placeholder-[#A69F98] transition-colors focus:border-[#5A5A40] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:cursor-not-allowed disabled:bg-[#FAF9F7] disabled:text-[#A69F98]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        {helperText && !error && (
          <span className="text-xs text-[#A69F98]">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
