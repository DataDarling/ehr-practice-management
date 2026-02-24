"use client";

import { LucideIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "teal" | "blue" | "purple" | "orange" | "red" | "green";
  format?: "number" | "percent" | "currency" | "time";
}

const colorClasses = {
  teal: "bg-teal-50 text-teal-600",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  green: "bg-green-50 text-green-600"
};

export function StatCard({ title, value, icon: Icon, trend, color = "teal", format = "number" }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const numericValue = typeof value === "number" ? value : parseFloat(String(value)) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries?.[0]?.isIntersecting) {
          let start = 0;
          const duration = 1000;
          const startTime = performance.now();
          
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(easeOut * numericValue));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(numericValue);
            }
          };
          
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [numericValue]);

  const formatValue = (val: number) => {
    switch (format) {
      case "percent":
        return `${val.toFixed(1)}%`;
      case "currency":
        return `$${val.toLocaleString()}`;
      case "time":
        return `${val} min`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div ref={ref} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {typeof value === "string" ? value : formatValue(displayValue)}
          </p>
          {trend && (
            <p className={cn(
              "text-sm mt-2 flex items-center gap-1",
              (trend?.value ?? 0) >= 0 ? "text-green-600" : "text-red-600"
            )}>
              <span>{(trend?.value ?? 0) >= 0 ? "↑" : "↓"} {Math.abs(trend?.value ?? 0)}%</span>
              <span className="text-gray-400">{trend?.label}</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
