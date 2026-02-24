import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import AnalyticsContent from "./_components/analytics-content";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (user?.role !== "ADMIN" && user?.role !== "DOCTOR") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Comprehensive insights and data visualization for your practice</p>
      </div>
      <AnalyticsContent />
    </div>
  );
}
