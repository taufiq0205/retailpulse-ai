import React from "react";
import { cn } from "../../lib/utils";

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto border border-[#E6E2DE] rounded-xl bg-white shadow-xs">
      <table className={cn("w-full text-left border-collapse text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <thead className={cn("bg-[#FAF9F7] border-b border-[#E6E2DE] text-[11px] font-bold text-[#7A7169] uppercase tracking-wider", className)} {...props}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tbody className={cn("divide-y divide-[#F1EFEC]", className)} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr className={cn("hover:bg-[#FAF9F7] transition-colors", className)} {...props}>
      {children}
    </tr>
  );
};

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <th className={cn("px-6 py-3.5 font-bold text-[#4A443F] align-middle", className)} {...props}>
      {children}
    </th>
  );
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td className={cn("px-6 py-4 text-[#4A443F] align-middle", className)} {...props}>
      {children}
    </td>
  );
};
