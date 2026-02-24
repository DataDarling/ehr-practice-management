"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";

const COLORS = ["#0d9488", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

interface DoctorData {
  name: string;
  specialty: string;
  totalAppointments: number;
  completed: number;
  utilization: number;
}

export default function DoctorUtilizationChart({ data }: { data: DoctorData[] }) {
  const safeData = data ?? [];

  if (safeData?.length === 0) {
    return <div className="h-72 flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} unit="%" />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            width={100}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: 12
            }}
            formatter={(value: any) => [`${(value ?? 0)?.toFixed?.(1) ?? 0}%`, "Utilization"]}
          />
          <Bar dataKey="utilization" name="Utilization %" radius={[0, 4, 4, 0]}>
            {safeData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {safeData?.map((doc, i) => (
          <div key={doc?.name ?? i} className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium text-sm text-gray-800">{doc?.name ?? "N/A"}</p>
            <p className="text-xs text-gray-500">{doc?.specialty ?? "N/A"}</p>
            <p className="text-sm text-teal-600 font-semibold mt-1">{doc?.totalAppointments ?? 0} appointments</p>
          </div>
        ))}
      </div>
    </div>
  );
}
