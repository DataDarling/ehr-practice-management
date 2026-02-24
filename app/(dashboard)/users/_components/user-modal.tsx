"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  doctors: any[];
  onSave: () => void;
}

export default function UserModal({ isOpen, onClose, user, doctors, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "RECEPTIONIST",
    doctorId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        email: user?.email ?? "",
        name: user?.name ?? "",
        password: "",
        role: user?.role ?? "RECEPTIONIST",
        doctorId: user?.doctorId ?? ""
      });
    } else {
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "RECEPTIONIST",
        doctorId: ""
      });
    }
    setError("");
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = user ? `/api/users/${user.id}` : "/api/users";
      const method = user ? "PUT" : "POST";

      const payload: any = {
        name: formData?.name,
        role: formData?.role,
        doctorId: formData?.doctorId || null
      };

      if (!user) {
        payload.email = formData?.email;
        payload.password = formData?.password;
      } else if (formData?.password) {
        payload.password = formData.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res?.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to save");
      }

      onSave();
    } catch (err: any) {
      setError(err?.message ?? "Failed to save user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? "Edit User" : "Add New User"}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required={!user}
              disabled={!!user}
              value={formData?.email ?? ""}
              onChange={(e) => setFormData(f => ({ ...f, email: e?.target?.value ?? "" }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={formData?.name ?? ""}
              onChange={(e) => setFormData(f => ({ ...f, name: e?.target?.value ?? "" }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {user ? "(leave blank to keep current)" : "*"}
            </label>
            <input
              type="password"
              required={!user}
              value={formData?.password ?? ""}
              onChange={(e) => setFormData(f => ({ ...f, password: e?.target?.value ?? "" }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select
              required
              value={formData?.role ?? "RECEPTIONIST"}
              onChange={(e) => setFormData(f => ({ ...f, role: e?.target?.value ?? "RECEPTIONIST" }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>

          {formData?.role === "DOCTOR" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Doctor Profile</label>
              <select
                value={formData?.doctorId ?? ""}
                onChange={(e) => setFormData(f => ({ ...f, doctorId: e?.target?.value ?? "" }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">Select doctor profile</option>
                {doctors?.map(d => (
                  <option key={d?.id} value={d?.id}>
                    Dr. {d?.firstName ?? ""} {d?.lastName ?? ""} - {d?.specialty ?? ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
