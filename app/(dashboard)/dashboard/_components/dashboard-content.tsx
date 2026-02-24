"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, Clock, AlertTriangle, CheckCircle, TrendingUp, UserPlus, Stethoscope } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import dynamic from "next/dynamic";

const AppointmentTrendChart = dynamic(() => import("./appointment-trend-chart"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });
const TypeDistributionChart = dynamic(() => import("./type-distribution-chart"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });
const DoctorUtilizationChart = dynamic(() => import("./doctor-utilization-chart"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });

interface DashboardContentProps {
  userRole?: string;
  doctorId?: string | null;
}

export default function DashboardContent({ userRole, doctorId }: DashboardContentProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        if (res?.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner className="h-96" />;
  }

  const summary = analytics?.summary ?? {};

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={summary?.totalPatients ?? 0}
          icon={Users}
          color="teal"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatCard
          title="Today's Appointments"
          value={summary?.todayAppointments ?? 0}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="No-Show Rate"
          value={summary?.noShowRate ?? 0}
          icon={AlertTriangle}
          color="orange"
          format="percent"
        />
        <StatCard
          title="Avg Wait Time"
          value={summary?.avgWaitTime ?? 0}
          icon={Clock}
          color="purple"
          format="time"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completed (30d)"
          value={summary?.completedCount ?? 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Scheduled"
          value={summary?.scheduledCount ?? 0}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Doctors"
          value={summary?.totalDoctors ?? 0}
          icon={Stethoscope}
          color="teal"
        />
        <StatCard
          title="New Patients (30d)"
          value={analytics?.monthlyRegistrations?.[analytics?.monthlyRegistrations?.length - 1]?.count ?? 0}
          icon={UserPlus}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Trends (14 Days)</h3>
          <AppointmentTrendChart data={analytics?.dailyTrend ?? []} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Types Distribution</h3>
          <TypeDistributionChart data={analytics?.typeDistribution ?? []} />
        </div>
      </div>

      {/* Doctor Utilization */}
      {(userRole === "ADMIN" || userRole === "DOCTOR") && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Doctor Utilization & Performance</h3>
          <DoctorUtilizationChart data={analytics?.doctorUtilization ?? []} />
        </div>
      )}
    </div>
  );
}
