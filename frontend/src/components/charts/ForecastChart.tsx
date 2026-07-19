import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatDate } from "../../lib/utils";
import { ForecastPoint } from "../../schemas";

interface ForecastChartProps {
  data: ForecastPoint[];
  horizonDays: number; // 7 or 28
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data, horizonDays }) => {
  // Filter data based on selected horizon.
  // We have 14 days of history (actuals is not null or first 14 rows).
  // Then we take only the requested forecast days ahead.
  const historyIndex = data.findIndex((pt) => pt.actual === null);
  const cutoffIndex = historyIndex === -1 ? data.length : historyIndex;

  const historyData = data.slice(0, cutoffIndex);
  const forecastData = data.slice(cutoffIndex, cutoffIndex + horizonDays);

  const displayData = [...historyData, ...forecastData].map((pt) => ({
    ...pt,
    formattedDate: formatDate(pt.date),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          {pData.actual !== null && pData.actual !== undefined && (
            <p className="text-slate-800 font-medium">
              Actual Sales: <span className="font-bold">{pData.actual} units</span>
            </p>
          )}
          <p className="text-emerald-600 font-medium">
            Predicted Demand: <span className="font-bold">{pData.predicted} units</span>
          </p>
          {pData.lower_bound !== null && pData.lower_bound !== undefined && (
            <p className="text-slate-400 font-medium">
              Confidence Band: <span className="font-semibold">{pData.lower_bound} - {pData.upper_bound} units</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={displayData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            stroke="#94a3b8"
            fontSize={10}
            dy={8}
            interval={Math.floor(displayData.length / 6)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={10}
            dx={-8}
            label={{ value: "Units Sold / Demanded", angle: -90, position: "insideLeft", offset: 10, style: { textAnchor: "middle", fontSize: 10, fill: "#64748b" } }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
          />

          {/* Uncertainty Range Band (Area) */}
          <Area
            type="monotone"
            dataKey={(pt) => [pt.lower_bound || pt.predicted, pt.upper_bound || pt.predicted]}
            name="Uncertainty Range (85% CI)"
            stroke="none"
            fill="#10b981"
            fillOpacity={0.12}
            legendType="rect"
          />

          {/* Actual demand line */}
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Demand"
            stroke="#334155"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: "#334155" }}
            activeDot={{ r: 5 }}
            connectNulls={true}
          />

          {/* Predicted demand line */}
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
  );
};
