"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";

const demoCredentials = [
  { role: "Admin", email: "admin@medportal.com", password: "password123", bgColor: "bg-teal-50" },
  { role: "Doctor", email: "sarah.chen@medportal.com", password: "password123", bgColor: "bg-blue-50" },
  { role: "Receptionist", email: "reception@medportal.com", password: "password123", bgColor: "bg-purple-50" }
];

export default function DemoCredentials() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mt-6 bg-white/80 backdrop-blur rounded-xl p-4 shadow-md h-40 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-100 rounded"></div>
          <div className="h-8 bg-gray-100 rounded"></div>
          <div className="h-8 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white/80 backdrop-blur rounded-xl p-4 shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-teal-600" />
        Demo Credentials
      </h3>
      <div className="space-y-2 text-sm">
        {demoCredentials?.map((cred) => (
          <div key={cred?.email} className={`flex items-center justify-between ${cred?.bgColor ?? "bg-gray-50"} p-2 rounded-lg`}>
            <span className="text-gray-700"><strong>{cred?.role}:</strong> {cred?.email}</span>
            <span className="text-gray-500">{cred?.password}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
