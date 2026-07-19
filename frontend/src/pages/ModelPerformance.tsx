import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { formatDate, formatDateTime } from "../lib/utils";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Cpu, RefreshCw, BarChart2, CheckCircle2, ShieldCheck } from "lucide-react";

export const ModelPerformance: React.FC = () => {
  const {
    data: perf,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["modelPerformance"],
    queryFn: () => api.getModelPerformance(),
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <p className="text-slate-700 font-medium">
            Actual: <span className="font-bold">{payload[0].value} units</span>
          </p>
          <p className="text-emerald-600 font-medium">
            Predicted: <span className="font-bold">{payload[1].value} units</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Error: {Math.abs(payload[0].value - payload[1].value)} units
          </p>
        </div>
      );
    }
    return null;
  };

  const chartData = perf?.comparison_data.map((d) => ({
    ...d,
    formattedDate: formatDate(d.date),
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-emerald-600" />
            Model Performance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor historical training runs, WMAPE scores, and backtesting predictions accuracy
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="self-start sm:self-center flex items-center gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Check Runs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Model Runs Table */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                Training Run History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : isError ? (
                <div className="p-6 text-center text-slate-400 text-xs">Error loading training runs.</div>
              ) : (
                <div className="divide-y divide-slate-150">
                  {perf?.model_runs.map((run, idx) => (
                    <div key={run.version} className={`p-4 hover:bg-slate-50/50 transition-colors ${idx === 0 ? "bg-emerald-50/10" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-slate-800">
                          {run.version}
                        </span>
                        {idx === 0 && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Trained: {formatDateTime(run.trained_at)}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">WMAPE</span>
                          <span className="font-mono font-black text-emerald-700 text-sm">{(run.wmape * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">MAE</span>
                          <span className="font-mono font-black text-slate-700 text-sm">{run.mae} u</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Comparison Visualizer Line Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <BarChart2 className="h-4.5 w-4.5 text-emerald-600" />
                Backtesting: Predicted vs Actual Sales (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full rounded-xl" />
              ) : isError ? (
                <div className="text-center py-16 text-slate-400 text-sm">Error loading comparison data.</div>
              ) : (
                <div className="w-full h-80 min-h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="formattedDate"
                        tickLine={false}
                        stroke="#94a3b8"
                        fontSize={10}
                        dy={8}
                        interval={Math.floor(chartData.length / 5)}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        stroke="#94a3b8"
                        fontSize={10}
                        dx={-8}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual Sales"
                        stroke="#334155"
                        strokeWidth={2}
                        dot={{ r: 3, strokeWidth: 0, fill: "#334155" }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Predicted Demand"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{ r: 3, strokeWidth: 0, fill: "#10b981" }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ModelPerformance;
