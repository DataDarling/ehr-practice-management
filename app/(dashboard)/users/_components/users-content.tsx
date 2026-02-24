"use client";

import { useState, useEffect } from "react";
import { Plus, User, Shield, Stethoscope, Phone, Trash2, Edit2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";
import UserModal from "./user-modal";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  doctorId?: string | null;
  doctor?: { firstName: string; lastName: string; specialty: string } | null;
  createdAt: string;
}

const roleIcons: Record<string, any> = {
  ADMIN: Shield,
  DOCTOR: Stethoscope,
  RECEPTIONIST: Phone
};

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  DOCTOR: "bg-teal-100 text-teal-700",
  RECEPTIONIST: "bg-blue-100 text-blue-700"
};

export default function UsersContent() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, docsRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/doctors")
      ]);
      if (usersRes?.ok) setUsers(await usersRes.json());
      if (docsRes?.ok) setDoctors(await docsRes.json());
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddNew = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res?.ok) fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleSave = () => {
    setModalOpen(false);
    fetchUsers();
  };

  if (loading) {
    return <LoadingSpinner className="h-96" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map(user => {
          const RoleIcon = roleIcons[user?.role ?? "RECEPTIONIST"] ?? User;
          return (
            <div key={user?.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${roleColors[user?.role ?? "RECEPTIONIST"]}`}>
                    <RoleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name ?? "N/A"}</p>
                    <p className="text-sm text-gray-500">{user?.email ?? "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(user?.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user?.role ?? "RECEPTIONIST"]}`}>
                    {user?.role ?? "N/A"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Joined {format(new Date(user?.createdAt ?? new Date()), "MMM d, yyyy")}
                  </span>
                </div>
                {user?.doctor && (
                  <p className="text-xs text-gray-500 mt-2">
                    Dr. {user?.doctor?.firstName ?? ""} {user?.doctor?.lastName ?? ""} - {user?.doctor?.specialty ?? ""}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        doctors={doctors}
        onSave={handleSave}
      />
    </div>
  );
}
