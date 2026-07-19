import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { RecommendationsTable } from "../components/features/RecommendationsTable";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Bell, RefreshCw, AlertTriangle } from "lucide-react";

export const Alerts: React.FC = () => {
  const {
    data: alerts = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => api.getAlerts(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-red-500 animate-pulse" />
            Stockout Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Urgent high-risk products nearing stockout, ordered by soonest stockout date
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Check Real-Time Alerts
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError ? (
        <div className="text-center p-8 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm font-semibold text-slate-700">Error loading alerts data</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            Retry
          </Button>
        </div>
      ) : (
        <RecommendationsTable
          data={alerts}
          title="Critical Reorders List"
          isAlertView={true}
        />
      )}
    </div>
  );
};
export default Alerts;
