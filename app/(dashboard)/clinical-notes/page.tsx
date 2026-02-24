import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import ClinicalNotesContent from "./_components/clinical-notes-content";

export default async function ClinicalNotesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (user?.role !== "ADMIN" && user?.role !== "DOCTOR") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clinical Notes</h1>
        <p className="text-gray-500 mt-1">View and manage SOAP notes for patient visits</p>
      </div>
      <ClinicalNotesContent />
    </div>
  );
}
