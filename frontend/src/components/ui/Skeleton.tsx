import React from "react";
import { cn } from "../../lib/utils";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("animate-pulse rounded bg-slate-200/80", className)}
      {...props}
    />
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex space-x-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
