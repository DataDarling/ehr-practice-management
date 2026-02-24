"use client";

import { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, User, Phone, Mail, Calendar } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PatientModal from "./patient-modal";
import { format } from "date-fns";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string | null;
  phone: string;
  insuranceProvider?: string | null;
}

export default function PatientsContent() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients?search=${encodeURIComponent(search)}&page=${page}&limit=10`);
      if (res?.ok) {
        const data = await res.json();
        setPatients(data?.patients ?? []);
        setPagination({ total: data?.pagination?.total ?? 0, pages: data?.pagination?.pages ?? 1 });
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchPatients();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, page]);

  const handleAddNew = () => {
    setSelectedPatient(null);
    setModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleSave = () => {
    setModalOpen(false);
    fetchPatients();
  };

  const getAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today?.getFullYear?.() - birthDate?.getFullYear?.();
    const m = today?.getMonth?.() - birthDate?.getMonth?.();
    if (m < 0 || (m === 0 && today?.getDate?.() < birthDate?.getDate?.())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={search}
            onChange={(e) => { setSearch(e?.target?.value ?? ""); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner className="h-64" />
        ) : patients?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No patients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Patient</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Age/Gender</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Insurance</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients?.map((patient) => (
                  <tr key={patient?.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-700 font-semibold">
                            {patient?.firstName?.charAt?.(0)?.toUpperCase?.() ?? ""}{patient?.lastName?.charAt?.(0)?.toUpperCase?.() ?? ""}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient?.firstName ?? ""} {patient?.lastName ?? ""}</p>
                          <p className="text-xs text-gray-500">ID: {patient?.id?.slice?.(0, 8) ?? "N/A"}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />{patient?.phone ?? "N/A"}
                        </p>
                        {patient?.email && (
                          <p className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />{patient?.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{getAge(patient?.dateOfBirth ?? "")} years</p>
                      <p className="text-xs text-gray-500 capitalize">{patient?.gender?.toLowerCase?.() ?? "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{patient?.insuranceProvider ?? "None"}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                      >
                        View/Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, pagination?.total ?? 0)} of {pagination?.total ?? 0} patients
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg font-medium">{page}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination?.pages ?? 1, p + 1))}
                disabled={page >= (pagination?.pages ?? 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      <PatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={selectedPatient}
        onSave={handleSave}
      />
    </div>
  );
}
