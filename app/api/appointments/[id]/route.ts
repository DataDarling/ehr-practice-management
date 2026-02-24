export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

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
    const updateData: any = {};

    if (body?.dateTime) {
      updateData.dateTime = new Date(body.dateTime);
      updateData.endTime = new Date(updateData.dateTime);
      updateData.endTime?.setMinutes?.(updateData.endTime?.getMinutes?.() + 30);
    }
    if (body?.status) updateData.status = body.status;
    if (body?.type) updateData.type = body.type;
    if (body?.doctorId) updateData.doctorId = body.doctorId;
    if (body?.reason !== undefined) updateData.reason = body.reason;
    if (body?.waitTime !== undefined) updateData.waitTime = body.waitTime;

    const appointment = await prisma.appointment.update({
      where: { id: params?.id },
      data: updateData,
      include: {
        patient: true,
        doctor: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.appointment.delete({ where: { id: params?.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete appointment error:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
