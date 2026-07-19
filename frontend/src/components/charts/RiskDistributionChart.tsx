import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface RiskCount {
  name: string;
  value: number;
}

interface RiskDistributionChartProps {
  data: RiskCount[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ data }) => {
  const COLORS: Record<string, string> = {
    "High Risk": "#ef4444", // red-500
    "Medium Risk": "#f59e0b", // amber-500
    "Low Risk": "#10b981", // emerald-500
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2.5 border border-slate-200 shadow-md rounded-lg text-xs">
          <p className="font-bold text-slate-800">{data.name}</p>
          <p className="font-semibold mt-1" style={{ color: data.payload.color }}>
            {data.value} products
          </p>
        </div>
      );
    }
    return null;
  };

  const formattedData = data
    .filter((d) => d.value > 0)
    .map((d) => ({
      ...d,
      color: COLORS[d.name] || "#64748b",
    }));

  if (formattedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No risk distribution data available.
      </div>
    );
  }

  return (
    <div className="w-full h-64 min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
