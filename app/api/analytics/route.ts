export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import { subDays, startOfDay, endOfDay, startOfMonth, format, eachDayOfInterval, eachHourOfInterval, startOfHour, addHours } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const ninetyDaysAgo = subDays(now, 90);

    // Total counts
    const [totalPatients, totalDoctors, totalAppointments] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count()
    ]);

    // Appointments by status in last 30 days
    const recentAppointments = await prisma.appointment.findMany({
      where: {
        dateTime: { gte: thirtyDaysAgo, lte: now }
      },
      select: {
        status: true,
        type: true,
        dateTime: true,
        waitTime: true,
        doctorId: true
      }
    });

    const completedCount = recentAppointments?.filter(a => a?.status === "COMPLETED")?.length ?? 0;
    const noShowCount = recentAppointments?.filter(a => a?.status === "NO_SHOW")?.length ?? 0;
    const scheduledCount = recentAppointments?.filter(a => a?.status === "SCHEDULED")?.length ?? 0;
    const cancelledCount = recentAppointments?.filter(a => a?.status === "CANCELLED")?.length ?? 0;
    const totalRecentCompleted = completedCount + noShowCount;
    const noShowRate = totalRecentCompleted > 0 ? ((noShowCount / totalRecentCompleted) * 100) : 0;

    // Average wait time
    const waitTimes = recentAppointments?.filter(a => a?.waitTime != null)?.map(a => a?.waitTime ?? 0) ?? [];
    const avgWaitTime = waitTimes?.length > 0 ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length : 0;

    // Appointments trend (daily for last 30 days)
    const appointmentsByDay = await prisma.appointment.groupBy({
      by: ["dateTime"],
      where: {
        dateTime: { gte: thirtyDaysAgo, lte: now }
      },
      _count: true
    });

    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
    const dailyTrend = days?.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      const count = recentAppointments?.filter(a => {
        const apptDate = new Date(a?.dateTime);
        return apptDate >= dayStart && apptDate <= dayEnd;
      })?.length ?? 0;
      return {
        date: format(day, "MMM dd"),
        appointments: count,
        completed: recentAppointments?.filter(a => {
          const apptDate = new Date(a?.dateTime);
          return apptDate >= dayStart && apptDate <= dayEnd && a?.status === "COMPLETED";
        })?.length ?? 0,
        noShow: recentAppointments?.filter(a => {
          const apptDate = new Date(a?.dateTime);
          return apptDate >= dayStart && apptDate <= dayEnd && a?.status === "NO_SHOW";
        })?.length ?? 0
      };
    }) ?? [];

    // Appointments by type
    const appointmentTypes = ["CHECKUP", "FOLLOW_UP", "CONSULTATION", "URGENT", "NEW_PATIENT"];
    const typeDistribution = appointmentTypes?.map(type => ({
      type: type?.replace("_", " "),
      count: recentAppointments?.filter(a => a?.type === type)?.length ?? 0
    })) ?? [];

    // Peak hours heatmap data (7 days x 12 hours)
    const sevenDaysAgo = subDays(now, 7);
    const weekAppointments = await prisma.appointment.findMany({
      where: {
        dateTime: { gte: sevenDaysAgo, lte: now },
        status: { in: ["COMPLETED", "SCHEDULED"] }
      },
      select: { dateTime: true }
    });

    const heatmapData: { day: string; hour: number; count: number }[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let d = 0; d < 7; d++) {
      for (let h = 8; h < 18; h++) {
        const count = weekAppointments?.filter(a => {
          const date = new Date(a?.dateTime);
          return date?.getDay?.() === d && date?.getHours?.() === h;
        })?.length ?? 0;
        heatmapData.push({ day: dayNames[d] ?? "N/A", hour: h, count });
      }
    }

    // Patient demographics
    const patients = await prisma.patient.findMany({
      select: { gender: true, dateOfBirth: true }
    });

    const genderDistribution = [
      { gender: "Male", count: patients?.filter(p => p?.gender === "MALE")?.length ?? 0 },
      { gender: "Female", count: patients?.filter(p => p?.gender === "FEMALE")?.length ?? 0 },
      { gender: "Other", count: patients?.filter(p => p?.gender === "OTHER")?.length ?? 0 }
    ];

    const getAge = (dob: Date) => {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today?.getFullYear?.() - birthDate?.getFullYear?.();
      const m = today?.getMonth?.() - birthDate?.getMonth?.();
      if (m < 0 || (m === 0 && today?.getDate?.() < birthDate?.getDate?.())) {
        age--;
      }
      return age;
    };

    const ageGroups = [
      { range: "18-30", min: 18, max: 30 },
      { range: "31-45", min: 31, max: 45 },
      { range: "46-60", min: 46, max: 60 },
      { range: "61-75", min: 61, max: 75 },
      { range: "75+", min: 76, max: 150 }
    ];

    const ageDistribution = ageGroups?.map(group => ({
      range: group?.range,
      count: patients?.filter(p => {
        const age = getAge(p?.dateOfBirth);
        return age >= (group?.min ?? 0) && age <= (group?.max ?? 150);
      })?.length ?? 0
    })) ?? [];

    // Doctor utilization
    const doctors = await prisma.doctor.findMany({
      include: {
        appointments: {
          where: {
            dateTime: { gte: thirtyDaysAgo, lte: now }
          }
        }
      }
    });

    const doctorUtilization = doctors?.map(doc => {
      const totalAppts = doc?.appointments?.length ?? 0;
      const completedAppts = doc?.appointments?.filter(a => a?.status === "COMPLETED")?.length ?? 0;
      const workingDays = 22; // Approx working days in a month
      const slotsPerDay = 8;
      const totalSlots = workingDays * slotsPerDay;
      const utilization = totalSlots > 0 ? (totalAppts / totalSlots) * 100 : 0;
      return {
        name: `Dr. ${doc?.firstName ?? ""} ${doc?.lastName ?? ""}`,
        specialty: doc?.specialty ?? "N/A",
        totalAppointments: totalAppts,
        completed: completedAppts,
        utilization: Math.min(utilization, 100)
      };
    }) ?? [];

    // Patient registrations trend (monthly for 90 days)
    const patientRegistrations = await prisma.patient.findMany({
      where: { createdAt: { gte: ninetyDaysAgo } },
      select: { createdAt: true }
    });

    const monthlyRegistrations: { month: string; count: number }[] = [];
    for (let i = 2; i >= 0; i--) {
      const monthStart = startOfMonth(subDays(now, i * 30));
      const monthName = format(monthStart, "MMM yyyy");
      const count = patientRegistrations?.filter(p => {
        const created = new Date(p?.createdAt);
        return format(created, "MMM yyyy") === monthName;
      })?.length ?? 0;
      monthlyRegistrations.push({ month: monthName, count });
    }

    // Today's appointments
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const todayAppointments = await prisma.appointment.count({
      where: {
        dateTime: { gte: todayStart, lte: todayEnd }
      }
    });

    // No-show rate trend
    const noShowTrend = [];
    for (let week = 3; week >= 0; week--) {
      const weekStart = subDays(now, (week + 1) * 7);
      const weekEnd = subDays(now, week * 7);
      const weekAppts = recentAppointments?.filter(a => {
        const d = new Date(a?.dateTime);
        return d >= weekStart && d < weekEnd && (a?.status === "COMPLETED" || a?.status === "NO_SHOW");
      }) ?? [];
      const weekNoShows = weekAppts?.filter(a => a?.status === "NO_SHOW")?.length ?? 0;
      const rate = weekAppts.length > 0 ? (weekNoShows / weekAppts.length) * 100 : 0;
      noShowTrend.push({
        week: `Week ${4 - week}`,
        rate: parseFloat(rate?.toFixed?.(1) ?? "0")
      });
    }

    return NextResponse.json({
      summary: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        todayAppointments,
        completedCount,
        noShowCount,
        scheduledCount,
        cancelledCount,
        noShowRate: parseFloat(noShowRate?.toFixed?.(1) ?? "0"),
        avgWaitTime: parseFloat(avgWaitTime?.toFixed?.(1) ?? "0")
      },
      dailyTrend: dailyTrend?.slice?.(-14) ?? [],
      typeDistribution,
      heatmapData,
      genderDistribution,
      ageDistribution,
      doctorUtilization,
      monthlyRegistrations,
      noShowTrend
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
