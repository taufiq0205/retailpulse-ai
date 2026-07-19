import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RecommendationsTable } from "../components/features/RecommendationsTable";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

export const Recommendations: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: recommendations = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => api.getRecommendations(),
  });

  const runReorderMutation = useMutation({
    mutationFn: () => api.generateRecommendations(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["alertsCount"] });
    },
  });

  const handleTriggerReorders = async () => {
    await runReorderMutation.mutateAsync();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order Suggestions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Reorder suggestions designed to protect your store against supply lead-time delays
          </p>
        </div>

        <Button
          onClick={handleTriggerReorders}
          isLoading={runReorderMutation.isPending}
          disabled={runReorderMutation.isPending}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <Sparkles className="h-4.5 w-4.5" />
          Run Reorder Modeling
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Helper Stat 1: Total items to reorder */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Suggested Reorders</p>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {recommendations.filter((r) => r.recommended_quantity > 0).length} <span className="text-xs font-normal text-emerald-700">SKUs</span>
            </p>
          </div>
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
        </div>

        {/* Helper Stat 2: High Risk items */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-800 uppercase tracking-wide">Critical High-Risk</p>
            <p className="text-2xl font-black text-red-950 mt-1">
              {recommendations.filter((r) => r.risk_level === "high").length} <span className="text-xs font-normal text-red-700">SKUs</span>
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Helper Stat 3: Med Risk items */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Attention (Medium Risk)</p>
            <p className="text-2xl font-black text-amber-950 mt-1">
              {recommendations.filter((r) => r.risk_level === "medium").length} <span className="text-xs font-normal text-amber-700">SKUs</span>
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-amber-500" />
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
          <p className="text-sm font-semibold text-slate-700">Error loading recommendations data</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            Retry
          </Button>
        </div>
      ) : (
        <RecommendationsTable data={recommendations} title="Reorder Recommendations Engine" />
      )}
    </div>
  );
};
export default Recommendations;
