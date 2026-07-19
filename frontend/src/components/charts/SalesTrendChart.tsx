import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatMYR, formatDate } from "../../lib/utils";

interface SalesTrendPoint {
  date: string;
  sales_amount: number;
  units_sold: number;
}

interface SalesTrendChartProps {
  data: SalesTrendPoint[];
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
  // Format dates for chart labels
  const formattedData = data.map((d) => ({
    ...d,
    formattedDate: formatDate(d.date),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg text-xs">
          <p className="font-bold text-slate-800 mb-1">{label}</p>
          <p className="text-emerald-600 font-medium">
            Revenue: <span className="font-bold">{formatMYR(payload[0].value)}</span>
          </p>
          <p className="text-slate-500 font-medium">
            Units Sold: <span className="font-bold">{payload[1].value} units</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 min-h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#64748b" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            stroke="#94a3b8"
            fontSize={10}
            dy={8}
            interval={Math.floor(data.length / 5)}
          />
          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={10}
            dx={-8}
            tickFormatter={(v) => `RM ${v}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={10}
            dx={8}
            tickFormatter={(v) => `${v}u`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="sales_amount"
            name="Revenue (RM)"
            stroke="#059669"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="units_sold"
            name="Units Sold"
            stroke="#64748b"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorUnits)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
