export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session?.user as any;
    const { searchParams } = new URL(request.url);
    const view = searchParams?.get?.("view") ?? "week";
    const dateStr = searchParams?.get?.("date") ?? new Date()?.toISOString?.();
    const doctorId = searchParams?.get?.("doctorId");
    const date = new Date(dateStr);

    let startDate: Date;
    let endDate: Date;

    if (view === "day") {
      startDate = startOfDay(date);
      endDate = endOfDay(date);
    } else if (view === "week") {
      startDate = startOfWeek(date, { weekStartsOn: 0 });
      endDate = endOfWeek(date, { weekStartsOn: 0 });
    } else {
      startDate = startOfMonth(date);
      endDate = endOfMonth(date);
    }

    const where: any = {
      dateTime: { gte: startDate, lte: endDate }
    };

    // If doctor role, only show their appointments
    if (user?.role === "DOCTOR" && user?.doctorId) {
      where.doctorId = user.doctorId;
    } else if (doctorId) {
      where.doctorId = doctorId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true
      },
      orderBy: { dateTime: "asc" }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const startTime = new Date(body?.dateTime);
    const endTime = new Date(startTime);
    endTime?.setMinutes?.(endTime?.getMinutes?.() + 30);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: body?.patientId,
        doctorId: body?.doctorId,
        dateTime: startTime,
        endTime,
        type: body?.type ?? "CHECKUP",
        status: "SCHEDULED",
        reason: body?.reason || null
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
