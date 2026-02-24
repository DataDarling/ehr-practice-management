"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  doctors: any[];
  patients: any[];
  onSave: () => void;
}

export default function AppointmentModal({ isOpen, onClose, appointment, doctors, patients, onSave }: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    type: "CHECKUP",
    status: "SCHEDULED",
    reason: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (appointment) {
      const dateTime = new Date(appointment?.dateTime);
      setFormData({
        patientId: appointment?.patientId ?? "",
        doctorId: appointment?.doctorId ?? "",
        date: format(dateTime, "yyyy-MM-dd"),
        time: format(dateTime, "HH:mm"),
        type: appointment?.type ?? "CHECKUP",
        status: appointment?.status ?? "SCHEDULED",
        reason: appointment?.reason ?? ""
      });
    } else {
      setFormData({
        patientId: "",
        doctorId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        type: "CHECKUP",
        status: "SCHEDULED",
        reason: ""
      });
    }
    setError("");
  }, [appointment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dateTime = new Date(`${formData?.date}T${formData?.time}`);
      const url = appointment ? `/api/appointments/${appointment.id}` : "/api/appointments";
      const method = appointment ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: formData?.patientId,
          doctorId: formData?.doctorId,
          dateTime: dateTime?.toISOString?.(),
          type: formData?.type,
          status: formData?.status,
          reason: formData?.reason || null
        })
      });

      if (!res?.ok) throw new Error("Failed to save");
      onSave();
    } catch (err) {
      setError("Failed to save appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!appointment || !confirm("Are you sure you want to delete this appointment?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, { method: "DELETE" });
      if (!res?.ok) throw new Error("Failed to delete");
      onSave();
    } catch (err) {
      setError("Failed to delete appointment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {appointment ? "Edit Appointment" : "New Appointment"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
            <select
              required
              value={formData?.patientId ?? ""}
              onChange={(e) => setFormData(f => ({ ...f, patientId: e?.target?.value ?? "" }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">Select patient</option>
              {patients?.map(p => (
                <option key={p?.id} value={p?.id}>{p?.firstName ?? ""} {p?.lastName ?? ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
            <select
              required
              value={formData?.doctorId ?? ""}
              onChange={(e) => setFormData(f => ({ ...f, doctorId: e?.target?.value ?? "" }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="">Select doctor</option>
              {doctors?.map(d => (
                <option key={d?.id} value={d?.id}>Dr. {d?.firstName ?? ""} {d?.lastName ?? ""} - {d?.specialty ?? ""}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData?.date ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, date: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                required
                value={formData?.time ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, time: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData?.type ?? "CHECKUP"}
                onChange={(e) => setFormData(f => ({ ...f, type: e?.target?.value ?? "CHECKUP" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="CHECKUP">Checkup</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="CONSULTATION">Consultation</option>
                <option value="URGENT">Urgent</option>
                <option value="NEW_PATIENT">New Patient</option>
              </select>
            </div>
            {appointment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData?.status ?? "SCHEDULED"}
                  onChange={(e) => setFormData(f => ({ ...f, status: e?.target?.value ?? "SCHEDULED" }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="NO_SHOW">No Show</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              value={formData?.reason ?? ""}
              onChange={(e) => setFormData(f => ({ ...f, reason: e?.target?.value ?? "" }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Reason for visit..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            {appointment && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {appointment ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
