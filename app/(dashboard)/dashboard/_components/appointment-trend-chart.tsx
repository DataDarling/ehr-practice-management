"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface DataPoint {
  date: string;
  appointments: number;
  completed: number;
  noShow: number;
}

export default function AppointmentTrendChart({ data }: { data: DataPoint[] }) {
  const safeData = data ?? [];

  if (safeData?.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px",
              fontSize: 12
            }} 
          />
          <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
          <Area 
            type="monotone" 
            dataKey="appointments" 
            name="Total"
            stroke="#0d9488" 
            fillOpacity={1} 
            fill="url(#colorAppt)" 
          />
          <Area 
            type="monotone" 
            dataKey="completed" 
            name="Completed"
            stroke="#22c55e" 
            fillOpacity={1} 
            fill="url(#colorCompleted)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
