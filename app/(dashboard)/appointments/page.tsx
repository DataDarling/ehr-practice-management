import AppointmentsContent from "./_components/appointments-content";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
        <p className="text-gray-500 mt-1">Manage and schedule patient appointments</p>
      </div>
      <AppointmentsContent />
    </div>
  );
}
