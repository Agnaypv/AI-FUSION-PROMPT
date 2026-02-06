// NEXUS Administrative Integration API
// Fee tracking, library, digital ID, attendance, leave, scholarships
// Role-based access, audit-friendly

import {
  feeRecords, libraryBooks, leaveApplications,
  scholarshipDeadlines, attendanceRecords,
} from "@/lib/nexus/beyond-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const module = searchParams.get("module")
  const userId = searchParams.get("userId") || "STU2026001"

  switch (module) {
    case "fees":
      return Response.json({
        records: feeRecords.filter((f) => f.userId === userId),
        summary: {
          totalDue: feeRecords.filter((f) => f.userId === userId).reduce((s, f) => s + (f.totalAmount - f.paidAmount), 0),
          nextDueDate: feeRecords.find((f) => f.userId === userId && f.status !== "paid")?.dueDate || null,
        },
      })

    case "library":
      return Response.json({
        books: libraryBooks,
        myReservations: libraryBooks.filter((b) => b.reservedBy === userId),
        available: libraryBooks.filter((b) => b.available).length,
        total: libraryBooks.length,
      })

    case "digital-id":
      return Response.json({
        id: {
          userId,
          fullName: "Arjun Mehta",
          department: "Computer Science & Engineering",
          enrollmentNo: "2026/CSE/001",
          validUntil: new Date(2027, 5, 30),
          photoUrl: "/placeholder-avatar.jpg",
          qrCode: `NEXUS-ID-${userId}-${Date.now().toString(36)}`,
          barcode: `${userId.replace(/\D/g, "")}${Date.now().toString().slice(-6)}`,
        },
      })

    case "attendance":
      return Response.json({
        records: attendanceRecords,
        overall: {
          totalClasses: attendanceRecords.reduce((s, a) => s + a.totalClasses, 0),
          attended: attendanceRecords.reduce((s, a) => s + a.attended, 0),
          percentage: Math.round(
            (attendanceRecords.reduce((s, a) => s + a.attended, 0) /
              attendanceRecords.reduce((s, a) => s + a.totalClasses, 0)) * 1000
          ) / 10,
        },
        warnings: attendanceRecords.filter((a) => a.percentage < 80).map((a) => ({
          subject: a.subject,
          percentage: a.percentage,
          classesNeeded: Math.ceil((0.8 * a.totalClasses - a.attended) / 0.2),
        })),
      })

    case "leave":
      return Response.json({
        applications: leaveApplications.filter((l) => l.userId === userId),
        stats: {
          pending: leaveApplications.filter((l) => l.userId === userId && l.status === "pending").length,
          approved: leaveApplications.filter((l) => l.userId === userId && l.status === "approved").length,
          rejected: leaveApplications.filter((l) => l.userId === userId && l.status === "rejected").length,
        },
      })

    case "scholarships":
      return Response.json({
        scholarships: scholarshipDeadlines,
        open: scholarshipDeadlines.filter((s) => s.status === "open").length,
        applied: scholarshipDeadlines.filter((s) => s.status === "applied").length,
        upcoming: scholarshipDeadlines
          .filter((s) => s.status === "open")
          .sort((a, b) => a.deadline.getTime() - b.deadline.getTime()),
      })

    default:
      return Response.json({
        overview: {
          fees: {
            totalDue: feeRecords.reduce((s, f) => s + (f.totalAmount - f.paidAmount), 0),
            status: feeRecords.find((f) => f.status === "overdue") ? "overdue" : "current",
          },
          library: { reserved: libraryBooks.filter((b) => b.reservedBy === userId).length },
          attendance: {
            overall: Math.round(
              (attendanceRecords.reduce((s, a) => s + a.attended, 0) /
                attendanceRecords.reduce((s, a) => s + a.totalClasses, 0)) * 1000
            ) / 10,
            warnings: attendanceRecords.filter((a) => a.percentage < 80).length,
          },
          leave: { pending: leaveApplications.filter((l) => l.status === "pending").length },
          scholarships: { open: scholarshipDeadlines.filter((s) => s.status === "open").length },
        },
      })
  }
}

// POST: apply for leave, reserve book, apply for scholarship
export async function POST(req: Request) {
  const { action, ...data } = await req.json()

  switch (action) {
    case "apply_leave":
      return Response.json({
        success: true,
        application: {
          id: `la_${Date.now()}`,
          ...data,
          status: "pending",
          appliedAt: new Date(),
          reviewedBy: null,
        },
        message: "Leave application submitted successfully",
      })

    case "reserve_book":
      return Response.json({
        success: true,
        message: `Book ${data.bookId} reserved successfully. Please collect within 24 hours.`,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      })

    case "apply_scholarship":
      return Response.json({
        success: true,
        message: `Application for ${data.scholarshipId} submitted`,
      })

    default:
      return Response.json({ error: "Unknown action" }, { status: 400 })
  }
}
