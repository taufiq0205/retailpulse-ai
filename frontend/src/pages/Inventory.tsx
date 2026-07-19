import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Inventory } from "../lib/api";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { Edit2, Check, X, RefreshCw, AlertTriangle, Info } from "lucide-react";

export const InventoryPage: React.FC = () => {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editLeadTime, setEditLeadTime] = useState<number>(0);
  const [editMinOrder, setEditMinOrder] = useState<number>(0);

  const queryClient = useQueryClient();

  const {
    data: inventory = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => api.getInventory(),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      leadTime,
      minOrder,
    }: {
      productId: string;
      leadTime: number;
      minOrder: number;
    }) => api.updateInventory(productId, leadTime, minOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["alertsCount"] });
      setEditingRowId(null);
    },
  });

  const handleStartEdit = (item: Inventory) => {
    setEditingRowId(item.product_id);
    setEditLeadTime(item.lead_time_days);
    setEditMinOrder(item.minimum_order_quantity);
  };

  const handleSaveEdit = async (productId: string) => {
    if (editLeadTime <= 0 || editMinOrder <= 0) return;
    await updateMutation.mutateAsync({
      productId,
      leadTime: editLeadTime,
      minOrder: editMinOrder,
    });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock &amp; Logistics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure supplier lead times, stock thresholds, and minimum order quantities (MOQ)
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Sync Stock"}
        </Button>
      </div>

      <div className="p-4 bg-slate-100/50 border border-slate-200/50 rounded-xl flex items-start gap-3">
        <Info className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-700">Suppliers Logistics Tip</p>
          <p className="mt-0.5">
            Updating the <strong>Lead Time (days)</strong> or <strong>Minimum Order Qty (MOQ)</strong> immediately recalculates restock points, safety stocks, and alerts across the dashboard in real-time.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <div className="text-center p-8 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-700">Error loading inventory data</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            Retry
          </Button>
        </div>
      ) : inventory.length === 0 ? (
        <div className="p-12 text-center border border-slate-200 border-dashed rounded-xl bg-white space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-sm font-bold text-slate-700">No Inventory Records Available</h3>
            <p className="text-xs text-slate-400 mt-1">
              Please register products under the catalogue screen first to establish inventory logs.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product details</TableHead>
              <TableHead className="text-right">Current Stock (units)</TableHead>
              <TableHead className="text-right">Lead Time (days)</TableHead>
              <TableHead className="text-right">Minimum Order Qty (MOQ)</TableHead>
              <TableHead className="text-right">Stock Status</TableHead>
              <TableHead className="text-center w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const isEditing = editingRowId === item.product_id;
              const isLowStock = item.current_stock < item.minimum_order_quantity * 0.25;

              return (
                <TableRow key={item.product_id} className={isLowStock ? "bg-red-50/10 hover:bg-red-50/20" : ""}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                      <span className="text-[11px] font-mono text-slate-400 mt-0.5 uppercase tracking-wide">
                        SKU: {item.sku}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-slate-800">
                    {item.current_stock}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        className="w-18 text-right font-mono text-sm border border-emerald-500 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={editLeadTime}
                        onChange={(e) => setEditLeadTime(parseInt(e.target.value) || 0)}
                      />
                    ) : (
                      <span className="text-slate-600 font-medium">{item.lead_time_days} days</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        className="w-24 text-right font-mono text-sm border border-emerald-500 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={editMinOrder}
                        onChange={(e) => setEditMinOrder(parseInt(e.target.value) || 0)}
                      />
                    ) : (
                      <span className="text-slate-600 font-medium">{item.minimum_order_quantity} units</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isLowStock ? (
                      <Badge variant="danger">LOW STOCK</Badge>
                    ) : item.current_stock < item.minimum_order_quantity * 0.6 ? (
                      <Badge variant="warning">REORDER POINT</Badge>
                    ) : (
                      <Badge variant="success">HEALTHY</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                          onClick={() => handleSaveEdit(item.product_id)}
                          isLoading={updateMutation.isPending}
                          title="Save Changes"
                        >
                          <Check className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-lg"
                          onClick={handleCancelEdit}
                          title="Cancel Editing"
                        >
                          <X className="h-4 w-4 text-slate-500" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex items-center justify-center gap-1 hover:border-emerald-500 hover:text-emerald-700"
                        onClick={() => handleStartEdit(item)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    )}
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
export default InventoryPage;
