"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

interface DataPoint {
  week: string;
  rate: number;
}

export default function NoShowTrendChart({ data }: { data: DataPoint[] }) {
  const safeData = data ?? [];

  if (safeData?.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  }

  const avgRate = safeData?.reduce((acc, d) => acc + (d?.rate ?? 0), 0) / (safeData?.length || 1);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: 12
            }}
            formatter={(value: any) => [`${value ?? 0}%`, "No-Show Rate"]}
          />
          <ReferenceLine y={avgRate} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: `Avg: ${avgRate?.toFixed?.(1) ?? 0}%`, fill: '#9ca3af', fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#f59e0b" 
            strokeWidth={3}
            dot={{ fill: "#f59e0b", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
