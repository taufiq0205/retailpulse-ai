import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { ForecastChart } from "../components/charts/ForecastChart";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { TrendingUp, RefreshCw, ChevronRight, BarChart2, ShieldAlert } from "lucide-react";

export const Forecasts: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("p-1");
  const [horizonDays, setHorizonDays] = useState<number>(28);

  const queryClient = useQueryClient();

  // Fetch product list for the selector
  const { data: productData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products-list"],
    queryFn: () => api.getProducts("", "all", 1, 100),
  });

  // Fetch forecast data for the selected product
  const {
    data: forecastResp,
    isLoading: isForecastLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["forecast", selectedProductId],
    queryFn: () => api.getForecast(selectedProductId),
    enabled: !!selectedProductId,
  });

  const generateMutation = useMutation({
    mutationFn: () => api.generateForecasts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forecast"] });
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
    },
  });

  const handleTriggerForecast = async () => {
    await generateMutation.mutateAsync();
  };

  const selectedProduct = productData?.data.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Demand Forecasting</h1>
          <p className="text-xs text-slate-400 mt-1">
            Predict customer demand and optimize restock schedules using machine learning models
          </p>
        </div>

        <Button
          onClick={handleTriggerForecast}
          isLoading={generateMutation.isPending}
          disabled={generateMutation.isPending}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${generateMutation.isPending ? "animate-spin" : ""}`} />
          Run Forecasting Run
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Product Selector Card */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Select Product
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {isProductsLoading ? (
                <div className="space-y-2 p-3">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {productData?.data.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`w-full text-left px-4 py-3 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between group ${
                        selectedProductId === prod.id
                          ? "bg-emerald-50 text-emerald-800 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        <span className="truncate">{prod.name}</span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                          SKU: {prod.sku}
                        </span>
                      </div>
                      <ChevronRight className={`h-3 w-3 ${selectedProductId === prod.id ? "text-emerald-600" : "text-slate-300 group-hover:text-slate-400"}`} />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Horizon Toggle & Main Forecast Chart */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  Demand Forecast: {selectedProduct?.name || "Active Product"}
                </CardTitle>
              </div>

              {/* Forecast Horizon Toggle (7 days vs 28 days) */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 self-start sm:self-center">
                <button
                  onClick={() => setHorizonDays(7)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    horizonDays === 7
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  7-Day Horizon
                </button>
                <button
                  onClick={() => setHorizonDays(28)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    horizonDays === 28
                      ? "bg-white text-emerald-700 shadow-xs border border-slate-100"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  28-Day Horizon
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {isForecastLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-80 w-full rounded-lg" />
                </div>
              ) : isError ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                  There was an error loading forecasting actuals or metrics. Please retry.
                </div>
              ) : forecastResp ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Chart view */}
                  <div className="lg:col-span-3">
                    <ForecastChart data={forecastResp.forecast} horizonDays={horizonDays} />
                  </div>

                  {/* Sidebar Panel: Accuracy & Error Metrics */}
                  <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-6 lg:pt-0 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <BarChart2 className="h-4 w-4 text-emerald-600" />
                      Accuracy Metrics
                    </h4>

                    <div className="space-y-3.5">
                      {/* Metric 1: WMAPE */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700">WMAPE</p>
                          <p className="text-[10px] text-slate-400">Weighted Mean Abs. Pct. Error</p>
                        </div>
                        <span className="text-sm font-black font-mono text-emerald-700">
                          {(forecastResp.metrics.wmape * 100).toFixed(1)}%
                        </span>
                      </div>

                      {/* Metric 2: MAE */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700">MAE</p>
                          <p className="text-[10px] text-slate-400">Mean Absolute Error</p>
                        </div>
                        <span className="text-sm font-black font-mono text-slate-700">
                          {forecastResp.metrics.mae.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">u</span>
                        </span>
                      </div>

                      {/* Metric 3: RMSE */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700">RMSE</p>
                          <p className="text-[10px] text-slate-400">Root Mean Squared Error</p>
                        </div>
                        <span className="text-sm font-black font-mono text-slate-700">
                          {forecastResp.metrics.rmse.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">u</span>
                        </span>
                      </div>

                      {/* Metric 4: Bias */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <p className="text-xs font-bold text-slate-700">Model Bias</p>
                          <p className="text-[10px] text-slate-400">Over(+) or Under(-) forecasting</p>
                        </div>
                        <span className={`text-sm font-black font-mono ${forecastResp.metrics.bias >= 0 ? "text-blue-600" : "text-amber-600"}`}>
                          {forecastResp.metrics.bias >= 0 ? "+" : ""}{forecastResp.metrics.bias.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[10px] text-slate-500 leading-relaxed flex gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>
                        Low WMAPE indicate precise restock points, minimizing storage fee overheads.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 text-sm">
                  No forecasts available. Click "Run Forecasting Run".
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Forecasts;
