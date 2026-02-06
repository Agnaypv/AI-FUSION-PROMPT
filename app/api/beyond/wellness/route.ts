// NEXUS Wellness & Lifestyle API
// Mental health reminders, fitness tracking, workout matching, sports scheduling
// Privacy-first, opt-in only

import { wellnessReminders, sportsSlots, workoutPartners } from "@/lib/nexus/beyond-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const module = searchParams.get("module")

  switch (module) {
    case "reminders":
      return Response.json({
        reminders: wellnessReminders,
        activeCount: wellnessReminders.filter((r) => r.isActive).length,
        nextReminder: wellnessReminders
          .filter((r) => r.isActive)
          .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
          .find((r) => {
            const now = new Date()
            const [h, m] = r.scheduledTime.split(":").map(Number)
            return h > now.getHours() || (h === now.getHours() && m > now.getMinutes())
          }) || null,
      })

    case "sports":
      return Response.json({
        slots: sportsSlots.map((s) => ({
          ...s,
          spotsLeft: s.maxPlayers - s.currentPlayers,
          isFull: s.currentPlayers >= s.maxPlayers,
        })),
        upcoming: sportsSlots.filter((s) => s.date >= new Date()).length,
      })

    case "partners":
      return Response.json({
        partners: workoutPartners.sort((a, b) => b.matchScore - a.matchScore),
      })

    default:
      return Response.json({
        overview: {
          reminders: {
            total: wellnessReminders.length,
            active: wellnessReminders.filter((r) => r.isActive).length,
          },
          sports: {
            upcomingSlots: sportsSlots.filter((s) => s.date >= new Date()).length,
            availableSpots: sportsSlots.reduce((s, sl) => s + (sl.maxPlayers - sl.currentPlayers), 0),
          },
          partners: {
            available: workoutPartners.length,
            topMatch: workoutPartners[0]?.userName || "None",
          },
        },
        reminders: wellnessReminders.filter((r) => r.isActive),
        sports: sportsSlots.filter((s) => s.date >= new Date()),
        partners: workoutPartners.slice(0, 3),
      })
  }
}

// POST: toggle reminder, join sports slot, request partner match
export async function POST(req: Request) {
  const { action, ...data } = await req.json()

  switch (action) {
    case "toggle_reminder":
      return Response.json({
        success: true,
        message: `Reminder ${data.reminderId} ${data.active ? "activated" : "deactivated"}`,
      })

    case "join_sport":
      return Response.json({
        success: true,
        message: `Joined ${data.slotId} successfully`,
      })

    case "request_partner":
      return Response.json({
        success: true,
        message: `Partner match request sent to ${data.partnerId}`,
      })

    default:
      return Response.json({ error: "Unknown action" }, { status: 400 })
  }
}
