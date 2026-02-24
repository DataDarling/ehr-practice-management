export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams?.get?.("search") ?? "";
    const page = parseInt(searchParams?.get?.("page") ?? "1");
    const limit = parseInt(searchParams?.get?.("limit") ?? "10");

    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search } }
      ]
    } : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.patient.count({ where })
    ]);

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get patients error:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const patient = await prisma.patient.create({
      data: {
        firstName: body?.firstName,
        lastName: body?.lastName,
        dateOfBirth: new Date(body?.dateOfBirth),
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
    console.error("Create patient error:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
