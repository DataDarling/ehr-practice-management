"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

const GENDER_COLORS = ["#3b82f6", "#ec4899", "#8b5cf6"];
const AGE_COLORS = ["#0d9488", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"];

interface DemographicsChartsProps {
  genderData: { gender: string; count: number }[];
  ageData: { range: string; count: number }[];
  type: "gender" | "age";
}

export default function DemographicsCharts({ genderData, ageData, type }: DemographicsChartsProps) {
  if (type === "gender") {
    const safeData = (genderData ?? [])?.filter(d => (d?.count ?? 0) > 0);
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
              outerRadius={80}
              dataKey="count"
              nameKey="gender"
              label={({ gender, percent }) => `${gender ?? ""} ${((percent ?? 0) * 100)?.toFixed?.(0) ?? 0}%`}
              labelLine={false}
            >
              {safeData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Age distribution bar chart
  const safeData = ageData ?? [];
  if (safeData?.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="range" tick={{ fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }}
          />
          <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
            {safeData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS?.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
