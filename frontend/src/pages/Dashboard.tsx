import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { SalesTrendChart } from "../components/charts/SalesTrendChart";
import { ForecastChart } from "../components/charts/ForecastChart";
import { Link } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  Calendar,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Bell,
} from "lucide-react";
import { formatDate } from "../lib/utils";

export const Dashboard: React.FC = () => {
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["salesSummary"],
    queryFn: () => api.getSalesSummary(),
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Failed to Load Dashboard</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          There was an error communicating with the inventory backend. Please check your connection and try again.
        </p>
        <Button onClick={() => refetch()} className="mt-4 flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time demand forecasting and inventory tracking for your store
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
          {isRefetching ? "Updating..." : "Refresh Stats"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      ) : (
        /* KPI Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Products */}
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Active SKU
                </span>
                <p className="text-3xl font-black text-slate-800">
                  {summary?.total_products}
                </p>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <Package className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: High Risk Products Count */}
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Critical High-Risk
                </span>
                <p className="text-3xl font-black text-slate-800">
                  {summary?.high_risk_count}
                </p>
              </div>
              <div className={`p-3.5 rounded-xl border ${summary?.high_risk_count && summary.high_risk_count > 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Avg Stock Coverage Days */}
          <Card className="relative overflow-hidden">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Avg Stock Coverage
                </span>
                <p className="text-3xl font-black text-slate-800">
                  {summary?.avg_stock_coverage_days} <span className="text-xs font-normal text-slate-400">days</span>
                </p>
              </div>
              <div className="p-3.5 bg-slate-100 rounded-xl text-slate-600 border border-slate-200/50">
                <Calendar className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Trend Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between py-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                Sales History (Last 28 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full rounded-lg" />
              ) : (
                <SalesTrendChart data={summary?.sales_trend || []} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Product Forecast-vs-Actual Mini Chart */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="flex items-center justify-between py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Top Demand: {summary?.top_product_forecast?.name || "No Forecasts"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              {isLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : summary?.top_product_forecast ? (
                <div className="space-y-2">
                  <ForecastChart data={summary.top_product_forecast.data as any} horizonDays={14} />
                  <div className="text-center">
                    <Link
                      to="/forecasts"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-500 hover:underline"
                    >
                      View Detailed 28-Day Horizon <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 text-xs py-8">
                  No forecasting data currently processed.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Alerts List */}
      <Card>
        <CardHeader className="flex items-center justify-between py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-red-500 animate-pulse" />
            Recent High-Risk Stockout Alerts
          </CardTitle>
          <Link
            to="/alerts"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-500 hover:underline flex items-center gap-1"
          >
            All Alerts <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : !summary?.recent_alerts || summary.recent_alerts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-medium">
              🎉 Outstanding! No critical stockout risks are currently detected.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Est. Stockout</th>
                    <th className="px-6 py-3">Recommended Order</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {summary.recent_alerts.map((alert) => (
                    <tr key={alert.product_id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3.5 font-bold text-slate-800">
                        {alert.name}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500">
                        {alert.sku}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          {formatDate(alert.estimated_stockout_date)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-700">
                        +{alert.recommended_quantity} units
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link to="/recommendations">
                          <Button variant="outline" size="sm" className="h-8">
                            Reorder Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Dashboard;
