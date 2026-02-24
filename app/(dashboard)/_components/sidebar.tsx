"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  UserCog,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = user?.role || "RECEPTIONIST";

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
    { href: "/patients", label: "Patients", icon: Users, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
    { href: "/appointments", label: "Appointments", icon: Calendar, roles: ["ADMIN", "DOCTOR", "RECEPTIONIST"] },
    { href: "/clinical-notes", label: "Clinical Notes", icon: FileText, roles: ["ADMIN", "DOCTOR"] },
    { href: "/analytics", label: "Analytics", icon: BarChart3, roles: ["ADMIN", "DOCTOR"] },
    { href: "/users", label: "User Management", icon: UserCog, roles: ["ADMIN"] },
  ];

  const filteredItems = navItems?.filter(item => item?.roles?.includes(role)) ?? [];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-teal-700 to-teal-800 text-white flex flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MedPortal Pro</h1>
            <p className="text-teal-200 text-xs">Practice Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {filteredItems?.map((item) => {
            const isActive = pathname === item?.href || pathname?.startsWith((item?.href ?? "") + "/");
            return (
              <li key={item?.href}>
                <Link
                  href={item?.href ?? "#"}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    isActive
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-teal-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item?.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="text-sm text-teal-100">Logged in as</p>
          <p className="font-medium truncate">{user?.name || "User"}</p>
          <p className="text-xs text-teal-200 mt-1 capitalize">{role?.toLowerCase()?.replace("_", " ")}</p>
        </div>
      </div>
    </div>
  );
}
