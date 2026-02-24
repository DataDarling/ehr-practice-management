import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import DashboardContent from "./_components/dashboard-content";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")?.[0] || "User"}</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening in your practice today</p>
      </div>
      <DashboardContent userRole={user?.role} doctorId={user?.doctorId} />
    </div>
  );
}
