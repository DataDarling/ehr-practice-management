import PatientsContent from "./_components/patients-content";

export default function PatientsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-500 mt-1">View and manage patient records</p>
        </div>
      </div>
      <PatientsContent />
    </div>
  );
}
