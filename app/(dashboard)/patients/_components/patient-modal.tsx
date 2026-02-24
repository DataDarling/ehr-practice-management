"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
  onSave: () => void;
}

export default function PatientModal({ isOpen, onClose, patient, onSave }: PatientModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "MALE",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    insuranceProvider: "",
    insuranceId: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medications: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient?.firstName ?? "",
        lastName: patient?.lastName ?? "",
        dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth)?.toISOString?.()?.split?.("T")?.[0] ?? "" : "",
        gender: patient?.gender ?? "MALE",
        email: patient?.email ?? "",
        phone: patient?.phone ?? "",
        address: patient?.address ?? "",
        city: patient?.city ?? "",
        state: patient?.state ?? "",
        zipCode: patient?.zipCode ?? "",
        insuranceProvider: patient?.insuranceProvider ?? "",
        insuranceId: patient?.insuranceId ?? "",
        emergencyContact: patient?.emergencyContact ?? "",
        emergencyPhone: patient?.emergencyPhone ?? "",
        allergies: patient?.allergies ?? "",
        medications: patient?.medications ?? ""
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "MALE",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        insuranceProvider: "",
        insuranceId: "",
        emergencyContact: "",
        emergencyPhone: "",
        allergies: "",
        medications: ""
      });
    }
    setError("");
  }, [patient, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = patient ? `/api/patients/${patient.id}` : "/api/patients";
      const method = patient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res?.ok) {
        throw new Error("Failed to save patient");
      }

      onSave();
    } catch (err) {
      setError("Failed to save patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {patient ? "Edit Patient" : "Add New Patient"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData?.firstName ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, firstName: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData?.lastName ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, lastName: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData?.dateOfBirth ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, dateOfBirth: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                required
                value={formData?.gender ?? "MALE"}
                onChange={(e) => setFormData(f => ({ ...f, gender: e?.target?.value ?? "MALE" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData?.phone ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, phone: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData?.email ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, email: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData?.address ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, address: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={formData?.city ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, city: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                value={formData?.state ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, state: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
              <input
                type="text"
                value={formData?.insuranceProvider ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, insuranceProvider: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance ID</label>
              <input
                type="text"
                value={formData?.insuranceId ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, insuranceId: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <input
                type="text"
                value={formData?.allergies ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, allergies: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
              <input
                type="text"
                value={formData?.medications ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, medications: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
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
              {patient ? "Update Patient" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
