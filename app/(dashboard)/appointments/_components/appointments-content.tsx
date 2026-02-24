"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Clock, User, Stethoscope } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AppointmentModal from "./appointment-modal";

interface Appointment {
  id: string;
  dateTime: string;
  endTime: string;
  type: string;
  status: string;
  reason?: string | null;
  patient: { id: string; firstName: string; lastName: string };
  doctor: { id: string; firstName: string; lastName: string; specialty: string };
}

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  NO_SHOW: "bg-red-100 text-red-700 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-700 border-gray-200"
};

const typeColors: Record<string, string> = {
  CHECKUP: "bg-teal-500",
  FOLLOW_UP: "bg-blue-500",
  CONSULTATION: "bg-purple-500",
  URGENT: "bg-red-500",
  NEW_PATIENT: "bg-orange-500"
};

export default function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?view=week&date=${currentDate?.toISOString?.()}`);
      if (res?.ok) {
        const data = await res.json();
        setAppointments(data ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsAndPatients = async () => {
    try {
      const [docsRes, patientsRes] = await Promise.all([
        fetch("/api/doctors"),
        fetch("/api/patients?limit=100")
      ]);
      if (docsRes?.ok) setDoctors(await docsRes.json());
      if (patientsRes?.ok) {
        const data = await patientsRes.json();
        setPatients(data?.patients ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  useEffect(() => {
    fetchDoctorsAndPatients();
  }, []);

  const getAppointmentsForDay = (day: Date) => {
    return appointments?.filter(apt => {
      const aptDate = new Date(apt?.dateTime);
      return isSameDay(aptDate, day);
    }) ?? [];
  };

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setModalOpen(true);
  };

  const handleEdit = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setModalOpen(true);
  };

  const handleSave = () => {
    setModalOpen(false);
    fetchAppointments();
  };

  return (
    <div className="space-y-4">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </h2>
          <button
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
          >
            Today
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner className="h-96" />
        ) : (
          <div className="grid grid-cols-7 min-h-[600px]">
            {weekDays?.map((day, i) => {
              const dayAppts = getAppointmentsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isWeekend = i === 0 || i === 6;
              return (
                <div
                  key={day?.toISOString?.()}
                  className={`border-r border-b border-gray-100 last:border-r-0 ${isWeekend ? "bg-gray-50" : ""}`}
                >
                  <div className={`p-3 border-b border-gray-100 text-center ${isToday ? "bg-teal-50" : ""}`}>
                    <p className="text-xs text-gray-500 uppercase">{format(day, "EEE")}</p>
                    <p className={`text-lg font-semibold ${isToday ? "text-teal-600" : "text-gray-900"}`}>
                      {format(day, "d")}
                    </p>
                  </div>
                  <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide">
                    {dayAppts?.length === 0 && !isWeekend && (
                      <p className="text-xs text-gray-400 text-center py-4">No appointments</p>
                    )}
                    {dayAppts?.map(apt => (
                      <button
                        key={apt?.id}
                        onClick={() => handleEdit(apt)}
                        className={`w-full text-left p-2 rounded-lg border transition hover:shadow-md ${statusColors[apt?.status ?? "SCHEDULED"]}`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <div className={`w-2 h-2 rounded-full ${typeColors[apt?.type ?? "CHECKUP"]}`} />
                          <span className="text-xs font-medium">
                            {format(new Date(apt?.dateTime), "h:mm a")}
                          </span>
                        </div>
                        <p className="text-xs font-medium truncate">
                          {apt?.patient?.firstName ?? ""} {apt?.patient?.lastName ?? ""}
                        </p>
                        <p className="text-xs opacity-75 truncate">
                          Dr. {apt?.doctor?.lastName ?? ""}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow-sm p-4">
        <span className="text-sm font-medium text-gray-700">Appointment Types:</span>
        {Object.entries(typeColors)?.map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs text-gray-600 capitalize">{type?.toLowerCase?.()?.replace?.("_", " ")}</span>
          </div>
        ))}
      </div>

      <AppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={selectedAppointment}
        doctors={doctors}
        patients={patients}
        onSave={handleSave}
      />
    </div>
  );
}
