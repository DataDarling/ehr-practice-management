"use client";

import { useState, useEffect } from "react";
import { FileText, User, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";

interface ClinicalNote {
  id: string;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
  createdAt: string;
  patient: { firstName: string; lastName: string };
  doctor: { firstName: string; lastName: string; specialty: string };
  appointment: { dateTime: string; type: string };
}

export default function ClinicalNotesContent() {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/clinical-notes?limit=50");
        if (res?.ok) {
          const data = await res.json();
          setNotes(data?.notes ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  if (loading) {
    return <LoadingSpinner className="h-96" />;
  }

  return (
    <div className="space-y-4">
      {notes?.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No clinical notes found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes?.map(note => (
            <div key={note?.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggleExpand(note?.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {note?.patient?.firstName ?? ""} {note?.patient?.lastName ?? ""}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Dr. {note?.doctor?.lastName ?? ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(note?.appointment?.dateTime ?? new Date()), "MMM d, yyyy")}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs capitalize">
                        {note?.appointment?.type?.toLowerCase?.()?.replace?.("_", " ") ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
                {expandedNote === note?.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedNote === note?.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-200 rounded flex items-center justify-center text-sm">S</span>
                        Subjective
                      </h4>
                      <p className="text-sm text-blue-900">{note?.subjective || "Not documented"}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-green-200 rounded flex items-center justify-center text-sm">O</span>
                        Objective
                      </h4>
                      <p className="text-sm text-green-900">{note?.objective || "Not documented"}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-200 rounded flex items-center justify-center text-sm">A</span>
                        Assessment
                      </h4>
                      <p className="text-sm text-purple-900">{note?.assessment || "Not documented"}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-200 rounded flex items-center justify-center text-sm">P</span>
                        Plan
                      </h4>
                      <p className="text-sm text-orange-900">{note?.plan || "Not documented"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
