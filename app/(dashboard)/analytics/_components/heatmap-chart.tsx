"use client";

interface HeatmapData {
  day: string;
  hour: number;
  count: number;
}

export default function HeatmapChart({ data }: { data: HeatmapData[] }) {
  const safeData = data ?? [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const maxCount = Math.max(...(safeData?.map(d => d?.count ?? 0) ?? [0]), 1);

  const getColor = (count: number) => {
    const intensity = (count ?? 0) / maxCount;
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 0.25) return "bg-teal-100";
    if (intensity < 0.5) return "bg-teal-300";
    if (intensity < 0.75) return "bg-teal-500";
    return "bg-teal-700";
  };

  const getCount = (day: string, hour: number) => {
    return safeData?.find(d => d?.day === day && d?.hour === hour)?.count ?? 0;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Hour labels */}
        <div className="flex mb-2">
          <div className="w-16"></div>
          {hours?.map(hour => (
            <div key={hour} className="flex-1 text-center text-xs text-gray-500">
              {hour > 12 ? `${hour - 12}PM` : hour === 12 ? "12PM" : `${hour}AM`}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        {days?.map(day => (
          <div key={day} className="flex items-center mb-1">
            <div className="w-16 text-sm font-medium text-gray-600">{day}</div>
            {hours?.map(hour => {
              const count = getCount(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className={`flex-1 h-10 rounded mx-0.5 flex items-center justify-center text-xs font-medium transition-all hover:scale-105 cursor-pointer ${getColor(count)} ${count > maxCount * 0.5 ? "text-white" : "text-gray-700"}`}
                  title={`${day} ${hour}:00 - ${count} appointments`}
                >
                  {count > 0 ? count : ""}
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-end mt-4 gap-2 text-xs text-gray-500">
          <span>Less</span>
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <div className="w-4 h-4 bg-teal-100 rounded"></div>
          <div className="w-4 h-4 bg-teal-300 rounded"></div>
          <div className="w-4 h-4 bg-teal-500 rounded"></div>
          <div className="w-4 h-4 bg-teal-700 rounded"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
