export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || (user?.role !== "ADMIN" && user?.role !== "DOCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams?.get?.("patientId");
    const page = parseInt(searchParams?.get?.("page") ?? "1");
    const limit = parseInt(searchParams?.get?.("limit") ?? "20");

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (user?.role === "DOCTOR" && user?.doctorId) {
      where.doctorId = user.doctorId;
    }

    const [notes, total] = await Promise.all([
      prisma.clinicalNote.findMany({
        where,
        include: {
          patient: true,
          doctor: true,
          appointment: true
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.clinicalNote.count({ where })
    ]);

    return NextResponse.json({
      notes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || (user?.role !== "ADMIN" && user?.role !== "DOCTOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const note = await prisma.clinicalNote.create({
      data: {
        appointmentId: body?.appointmentId,
        patientId: body?.patientId,
        doctorId: body?.doctorId || user?.doctorId,
        subjective: body?.subjective || null,
        objective: body?.objective || null,
        assessment: body?.assessment || null,
        plan: body?.plan || null
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
