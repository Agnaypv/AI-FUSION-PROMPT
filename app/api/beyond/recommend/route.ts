// NEXUS Global Recommendation Engine API
// Cross-module signals: academic stress, activity patterns, preferences, marketplace, travel
// Used by dashboard, chatbot, and beyond hub

import { buildContext } from "@/lib/nexus/intelligence-engine"
import { assignments, subjectGrades } from "@/lib/nexus/mock-data"
import { attendanceRecords, scholarshipDeadlines, sportsSlots, wellnessReminders } from "@/lib/nexus/beyond-data"
import type { RecommendationItem } from "@/lib/nexus/beyond-types"

function generateRecommendations(): RecommendationItem[] {
  const ctx = buildContext()
  const recs: RecommendationItem[] = []
  const now = new Date()

  // Academic stress signals
  if (ctx.academicStress > 60) {
    const weakest = [...subjectGrades].sort((a, b) => a.percentage - b.percentage)[0]
    recs.push({
      id: "rec_study",
      type: "action",
      title: "Focus on " + (weakest?.subject || "weakest subject"),
      description: `Your academic stress is high (${ctx.academicStress}/100). ${weakest ? `${weakest.subject} is at ${weakest.percentage}%.` : ""} Schedule a study session now.`,
      score: 90,
      source: "academic",
      actionUrl: "/academic",
    })
  }

  // Attendance warnings
  const lowAttendance = attendanceRecords.filter((a) => a.percentage < 80)
  for (const a of lowAttendance) {
    recs.push({
      id: `rec_attend_${a.subjectCode}`,
      type: "alert",
      title: `Low attendance: ${a.subject}`,
      description: `${a.percentage.toFixed(1)}% attendance in ${a.subject}. Most institutions require 75%. Attend the next class.`,
      score: 85,
      source: "academic",
      actionUrl: "/beyond",
    })
  }

  // Upcoming deadlines
  const urgentAssignments = assignments
    .filter((a) => a.status !== "submitted" && a.status !== "graded" && a.dueDate > now)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 2)

  for (const a of urgentAssignments) {
    const daysLeft = Math.ceil((a.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    recs.push({
      id: `rec_deadline_${a.id}`,
      type: "alert",
      title: `${a.title} due in ${daysLeft}d`,
      description: `Worth ${a.weight}% of ${a.subject}. ${daysLeft <= 2 ? "URGENT: Start now." : "Plan your time."}`,
      score: daysLeft <= 2 ? 95 : 70,
      source: "academic",
      actionUrl: "/academic",
    })
  }

  // Scholarship suggestions
  const openScholarships = scholarshipDeadlines.filter((s) => s.status === "open")
  if (openScholarships.length > 0) {
    recs.push({
      id: "rec_scholarship",
      type: "suggestion",
      title: `${openScholarships.length} scholarship(s) open`,
      description: `${openScholarships[0].name} (${openScholarships[0].provider}) - up to Rs. ${openScholarships[0].amount.toLocaleString()}. Deadline: ${openScholarships[0].deadline.toLocaleDateString()}.`,
      score: 65,
      source: "admin",
      actionUrl: "/beyond",
    })
  }

  // Wellness suggestions based on time of day
  const hour = now.getHours()
  const activeReminders = wellnessReminders.filter((r) => {
    const [h] = r.scheduledTime.split(":").map(Number)
    return r.isActive && Math.abs(h - hour) <= 1
  })
  for (const r of activeReminders) {
    recs.push({
      id: `rec_wellness_${r.id}`,
      type: "suggestion",
      title: r.message,
      description: `Scheduled for ${r.scheduledTime}. ${r.type === "exercise" ? "A short workout boosts focus." : "Small habits build big results."}`,
      score: 40,
      source: "wellness",
    })
  }

  // Sports activities
  const upcomingSports = sportsSlots.filter((s) => s.currentPlayers < s.maxPlayers)
  if (upcomingSports.length > 0 && hour >= 16 && hour <= 20) {
    const slot = upcomingSports[0]
    recs.push({
      id: `rec_sport_${slot.id}`,
      type: "suggestion",
      title: `Join ${slot.sport} today`,
      description: `${slot.currentPlayers}/${slot.maxPlayers} players at ${slot.facility}. ${slot.startTime}-${slot.endTime}.`,
      score: 35,
      source: "wellness",
      actionUrl: "/beyond",
    })
  }

  // Meal timing suggestions
  if (ctx.mealStatus === "pending" && hour >= 7 && hour <= 9) {
    recs.push({
      id: "rec_breakfast",
      type: "suggestion",
      title: "Don't skip breakfast",
      description: "Breakfast improves focus and academic performance. Check today's menu.",
      score: 50,
      source: "mess",
      actionUrl: "/mess",
    })
  }

  // Sort by score descending
  return recs.sort((a, b) => b.score - a.score)
}

export async function GET() {
  const recommendations = generateRecommendations()
  return Response.json({
    recommendations,
    generatedAt: new Date().toISOString(),
    totalSignals: recommendations.length,
  })
}
