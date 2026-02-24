"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const COLORS = ["#0d9488", "#06b6d4", "#3b82f6"];

interface DataPoint {
  month: string;
  count: number;
}

export default function PatientGrowthChart({ data }: { data: DataPoint[] }) {
  const safeData = data ?? [];

  if (safeData?.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }}
          />
          <Bar dataKey="count" name="New Patients" radius={[8, 8, 0, 0]}>
            {safeData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
