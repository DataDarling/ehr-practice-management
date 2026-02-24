export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: params?.id },
      include: {
        appointments: {
          include: { doctor: true },
          orderBy: { dateTime: "desc" },
          take: 10
        },
        notes: {
          include: { doctor: true },
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Get patient error:", error);
    return NextResponse.json({ error: "Failed to fetch patient" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const patient = await prisma.patient.update({
      where: { id: params?.id },
      data: {
        firstName: body?.firstName,
        lastName: body?.lastName,
        dateOfBirth: body?.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body?.gender,
        email: body?.email || null,
        phone: body?.phone,
        address: body?.address || null,
        city: body?.city || null,
        state: body?.state || null,
        zipCode: body?.zipCode || null,
        insuranceProvider: body?.insuranceProvider || null,
        insuranceId: body?.insuranceId || null,
        emergencyContact: body?.emergencyContact || null,
        emergencyPhone: body?.emergencyPhone || null,
        medicalHistory: body?.medicalHistory || null,
        allergies: body?.allergies || null,
        medications: body?.medications || null
      }
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Update patient error:", error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    if (!session || user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.patient.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete patient error:", error);
    return NextResponse.json({ error: "Failed to delete patient" }, { status: 500 });
  }
}
