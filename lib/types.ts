import { UserRole, AppointmentStatus, AppointmentType, Gender } from "@prisma/client";

export type { UserRole, AppointmentStatus, AppointmentType, Gender };

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  doctorId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  specialty: string;
  licenseNo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  email?: string | null;
  phone: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  insuranceProvider?: string | null;
  insuranceId?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  medicalHistory?: string | null;
  allergies?: string | null;
  medications?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: Date;
  endTime: Date;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string | null;
  waitTime?: number | null;
  patient?: Patient;
  doctor?: Doctor;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClinicalNote {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  doctorId?: string | null;
}
