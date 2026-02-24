"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#0d9488", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

interface DataPoint {
  type: string;
  count: number;
}

export default function TypeDistributionChart({ data }: { data: DataPoint[] }) {
  const safeData = (data ?? [])?.filter(d => (d?.count ?? 0) > 0);

  if (safeData?.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={safeData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="count"
            nameKey="type"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100)?.toFixed?.(0) ?? 0}%`}
            labelLine={false}
          >
            {safeData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: 12
            }} 
          />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
