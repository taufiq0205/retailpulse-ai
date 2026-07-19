import React, { useState } from "react";
import { Download, AlertTriangle, Check, ShieldAlert } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { exportToCSV, getRiskColorClass, formatDate } from "../../lib/utils";
import { Recommendation } from "../../lib/api";

interface RecommendationsTableProps {
  data: Recommendation[];
  title?: string;
  isAlertView?: boolean; // If true, filter to high-risk only and hide non-urgent features
}

export const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
  data,
  title = "Restock Recommendations",
  isAlertView = false,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const filteredData = data.filter((item) => {
    if (isAlertView) return item.risk_level === "high";
    if (filter === "all") return true;
    return item.risk_level === filter;
  });

  const handleExport = () => {
    const headers = [
      "Product Name",
      "SKU",
      "Category",
      "Risk Level",
      "Current Stock",
      "Reorder Point",
      "Safety Stock",
      "Recommended Order Qty",
      "Estimated Stockout Date",
    ];

    const rows = filteredData.map((item) => [
      item.product_name,
      item.sku,
      item.category,
      item.risk_level.toUpperCase(),
      item.current_stock,
      item.reorder_point,
      item.safety_stock,
      item.recommended_quantity,
      item.estimated_stockout_date,
    ]);

    const filename = isAlertView
      ? "retailpulse_high_risk_alerts.csv"
      : "retailpulse_reorder_recommendations.csv";

    exportToCSV(filename, headers, rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filteredData.length} records found based on safety stock modeling
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isAlertView && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex h-10 w-full sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">🔴 High Risk</option>
              <option value="medium">🟡 Medium Risk</option>
              <option value="low">🟢 Low Risk</option>
            </select>
          )}

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="w-full sm:w-auto flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 border-dashed rounded-xl bg-white space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <Check className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-slate-700">No Restock Action Needed</h3>
            <p className="text-xs text-slate-400 mt-1">
              All items are currently at comfortable stock thresholds. No reorders or critical actions are required.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product details</TableHead>
              <TableHead>Risk Status</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Safety Stock</TableHead>
              <TableHead className="text-right">Reorder Point</TableHead>
              <TableHead className="text-right">Recommended Qty</TableHead>
              <TableHead>Est. Stockout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
              const colors = getRiskColorClass(item.risk_level);
              return (
                <TableRow key={item.product_id} className={item.risk_level === "high" && isAlertView ? "bg-red-50/20" : ""}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{item.product_name}</span>
                      <span className="text-[11px] font-mono text-slate-400 mt-0.5 uppercase tracking-wide">
                        SKU: {item.sku} • {item.category}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.risk_level === "high" ? "danger" : item.risk_level === "medium" ? "warning" : "success"}>
                      {item.risk_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {item.current_stock}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-500">
                    {item.safety_stock}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-500">
                    {item.reorder_point}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-800 font-bold">
                    {item.recommended_quantity > 0 ? (
                      <span className="text-emerald-700">+{item.recommended_quantity}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {item.risk_level === "high" ? (
                        <ShieldAlert className="h-4 w-4 text-red-500 flex-shrink-0" />
                      ) : null}
                      <span className={item.risk_level === "high" ? "font-bold text-red-700 text-xs" : "text-slate-600 text-xs"}>
                        {formatDate(item.estimated_stockout_date)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default RecommendationsTable;
