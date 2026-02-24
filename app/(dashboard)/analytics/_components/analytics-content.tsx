"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import dynamic from "next/dynamic";

const NoShowTrendChart = dynamic(() => import("./no-show-trend-chart"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });
const DemographicsCharts = dynamic(() => import("./demographics-charts"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });
const HeatmapChart = dynamic(() => import("./heatmap-chart"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });
const PatientGrowthChart = dynamic(() => import("./patient-growth-chart"), { ssr: false, loading: () => <LoadingSpinner className="h-64" /> });

export default function AnalyticsContent() {
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

  return (
    <div className="space-y-6">
      {/* Row 1: Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Demographics - Gender</h3>
          <DemographicsCharts 
            genderData={analytics?.genderDistribution ?? []} 
            ageData={analytics?.ageDistribution ?? []} 
            type="gender"
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Demographics - Age Groups</h3>
          <DemographicsCharts 
            genderData={analytics?.genderDistribution ?? []} 
            ageData={analytics?.ageDistribution ?? []} 
            type="age"
          />
        </div>
      </div>

      {/* Row 2: No-show trend and patient growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">No-Show Rate Trend (Weekly)</h3>
          <NoShowTrendChart data={analytics?.noShowTrend ?? []} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">New Patient Registrations</h3>
          <PatientGrowthChart data={analytics?.monthlyRegistrations ?? []} />
        </div>
      </div>

      {/* Row 3: Peak Hours Heatmap */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Hours Heatmap (Appointments by Day & Hour)</h3>
        <HeatmapChart data={analytics?.heatmapData ?? []} />
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-xl font-bold mb-6">Practice Summary (Last 30 Days)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-teal-100 text-sm">Total Appointments</p>
            <p className="text-4xl font-bold">{analytics?.summary?.completedCount + analytics?.summary?.noShowCount + analytics?.summary?.cancelledCount + analytics?.summary?.scheduledCount || 0}</p>
          </div>
          <div>
            <p className="text-teal-100 text-sm">Completion Rate</p>
            <p className="text-4xl font-bold">
              {((analytics?.summary?.completedCount / (analytics?.summary?.completedCount + analytics?.summary?.noShowCount || 1)) * 100)?.toFixed?.(1) ?? 0}%
            </p>
          </div>
          <div>
            <p className="text-teal-100 text-sm">Active Doctors</p>
            <p className="text-4xl font-bold">{analytics?.summary?.totalDoctors ?? 0}</p>
          </div>
          <div>
            <p className="text-teal-100 text-sm">Total Patients</p>
            <p className="text-4xl font-bold">{analytics?.summary?.totalPatients ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
