// Styling utility
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

// Currency Formatter - Ringgit Malaysia (RM)
export function formatMYR(value: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(value);
}

// Date Formatter - e.g. "15 Jul 2026"
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Date Formatter with Time - e.g. "15 Jul 2026, 10:30 AM"
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

// Risk level mapping to color tokens
export function getRiskColorClass(riskLevel: "high" | "medium" | "low" | string): {
  badge: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (riskLevel?.toLowerCase()) {
    case "high":
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        bg: "bg-red-50/50",
        text: "text-red-800",
        border: "border-red-100",
      };
    case "medium":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        bg: "bg-amber-50/50",
        text: "text-amber-800",
        border: "border-amber-100",
      };
    case "low":
    default:
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        bg: "bg-emerald-50/50",
        text: "text-emerald-800",
        border: "border-emerald-100",
      };
  }
}

// Utility to export an array of objects to a downloadable CSV
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format CSV validation errors
export function formatUploadErrors(errors: { row: number; column: string; message: string }[]): string {
  if (!errors || errors.length === 0) return "No validation errors found.";
  return errors
    .map((err) => `Row ${err.row}, Column [${err.column}]: ${err.message}`)
    .join("\n");
}
